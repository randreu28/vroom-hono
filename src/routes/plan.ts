import { createRoute, type RouteHandler, z } from "@hono/zod-openapi";
import { $ } from "bun";
import planRequestExample from "@/examples/plan_request.json";
import planResponseExample from "@/examples/plan_response.json";
import { jobsSchema } from "@/schemas/jobs";
import { matricesSchema } from "@/schemas/matrices";
import { outputSchema } from "@/schemas/output";
import { shipmentsSchema } from "@/schemas/shipments";
import { vehicleSchema, vehicleStepSchema } from "@/schemas/vehicles";
import { vroomCodesToHttpCodes } from "@/utils";

const planVehicleSchema = vehicleSchema.extend({
	steps: z.array(vehicleStepSchema).min(1).openapi({
		description: "Required custom route description in plan mode.",
	}),
});

const planRequestSchema = z.object({
	vehicles: z.array(planVehicleSchema).min(1),
	jobs: jobsSchema.optional(),
	shipments: shipmentsSchema.optional(),
	matrices: matricesSchema.optional(),
});

export const planRoute = createRoute({
	method: "post",
	path: "/plan",
	tags: ["Route optimization endpoints"],
	summary: "Plan",
	description:
		"Compute ETA for a user-provided route plan. All constraints are treated as soft constraints and violations are reported.",
	request: {
		body: {
			content: {
				"application/json": {
					schema: planRequestSchema,
					example: planRequestExample,
				},
			},
		},
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: outputSchema,
					example: planResponseExample,
				},
			},
			description: "VROOM planned the request successfully.",
		},
		400: {
			content: {
				"application/json": {
					schema: outputSchema,
					example: {
						code: 2,
						error: "The request payload is invalid.",
					},
				},
			},
			description: "The request is invalid.",
		},
		413: {
			content: {
				"application/json": {
					schema: outputSchema,
					example: {
						code: 2,
						error: "The request payload is too large.",
					},
				},
			},
			description: "The request payload is too large.",
		},
		500: {
			content: {
				"application/json": {
					schema: outputSchema,
					example: {
						code: 1,
						error: "Planning is not implemented.",
					},
				},
			},
			description: "The server failed to process the request.",
		},
	},
});

export const planHandler: RouteHandler<typeof planRoute> = async (c) => {
	const payload = c.req.valid("json");
	const input = new Response(JSON.stringify(payload), {
		headers: { "content-type": "application/json" },
	});

	const host = Bun.env.VROOM_OSRM_HOST ?? "localhost";
	const port = Bun.env.VROOM_OSRM_PORT ?? "5000";
	// The -c flag tells vroom to run in plan mode.
	const { stdout } = await $`./vroom -a ${host} -p ${port} -c < ${input}`
		.nothrow()
		.quiet();
	const json = JSON.parse(stdout.toString("utf8"));

	const res = outputSchema.safeParse(json);
	if (!res.success) {
		return c.json(
			{
				code: 1,
				error: "Internal parsing failed",
			},
			500,
		);
	}
	const output = res.data;

	return c.json(output, vroomCodesToHttpCodes(output.code));
};
