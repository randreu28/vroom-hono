import { createRoute, type RouteHandler, z } from "@hono/zod-openapi";
import solveRequestExample from "@/examples/solve_request.json";
import solveResponseExample from "@/examples/solve_response.json";
import { jobsSchema } from "@/schemas/jobs";
import { matricesSchema } from "@/schemas/matrices";
import { outputSchema } from "@/schemas/output";
import { shipmentsSchema } from "@/schemas/shipments";
import { vehiclesSchema } from "@/schemas/vehicles";

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
		"Submit your scenario, and get optimal routes back—fast and efficient.",
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

export const solveHandler: RouteHandler<typeof solveRoute> = (c) => {
	c.req.valid("json");

	return c.json(
		{
			code: 1,
			error: "Solving is not implemented.",
		},
		500,
	);
};
