import { createRoute, type RouteHandler, z } from "@hono/zod-openapi";
import solveRequestExample from "@/examples/solve_request.json";
import solveResponseExample from "@/examples/solve_response.json";
import { jobsSchema } from "@/schemas/jobs";
import { matricesSchema } from "@/schemas/matrices";
import { outputSchema } from "@/schemas/output";
import { shipmentsSchema } from "@/schemas/shipments";
import { vehiclesSchema } from "@/schemas/vehicles";
import { runVroom } from "@/vroom";
import { vroomCodesToHttpCodes } from "@/vroom/utils";

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
	const output = await runVroom({ payload });
	return c.json(output, vroomCodesToHttpCodes(output.code));
};
