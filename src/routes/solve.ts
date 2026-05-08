import { createRoute, type RouteHandler, z } from "@hono/zod-openapi";
import { $ } from "bun";
import solveRequestExample from "@/examples/solve_request.json";
import solveResponseExample from "@/examples/solve_response.json";
import { jobsSchema } from "@/schemas/jobs";
import { matricesSchema } from "@/schemas/matrices";
import { outputSchema } from "@/schemas/output";
import { shipmentsSchema } from "@/schemas/shipments";
import { vehiclesSchema } from "@/schemas/vehicles";
import { vroomCodesToHttpCodes } from "@/utils";

const solveRequestSchema = z.object({
	vehicles: vehiclesSchema,
	jobs: jobsSchema.optional(),
	shipments: shipmentsSchema.optional(),
	matrices: matricesSchema.optional(),
});

export const solveRoute = createRoute({
	method: "post",
	path: "/solve",
	tags: ["Route optimization endpoints"],
	summary: "Solve",
	description:
		"The default solving mode takes as input the description of a vehicle routing problem and outputs a set of routes matching all constraints.",
	request: {
		body: {
			content: {
				"application/json": {
					schema: solveRequestSchema,
					example: solveRequestExample,
				},
			},
		},
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: outputSchema,
					example: solveResponseExample,
				},
			},
			description: "VROOM solved the request successfully.",
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
						error: "Solving is not implemented.",
					},
				},
			},
			description: "The server failed to process the request.",
		},
	},
});

export const solveHandler: RouteHandler<typeof solveRoute> = async (c) => {
	const payload = c.req.valid("json");
	const input = new Response(JSON.stringify(payload), {
		headers: { "content-type": "application/json" },
	});

	const host = Bun.env.VROOM_OSRM_HOST ?? "localhost";
	const port = Bun.env.VROOM_OSRM_PORT ?? "5000";
	const { stdout } = await $`./vroom -a ${host} -p ${port} < ${input}`
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
