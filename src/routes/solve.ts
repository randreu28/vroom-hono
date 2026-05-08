import { createRoute, type RouteHandler, z } from "@hono/zod-openapi";
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
				},
			},
		},
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: outputSchema,
				},
			},
			description: "VROOM output envelope.",
		},
	},
});

export const solveHandler: RouteHandler<typeof solveRoute> = (c) => {
	c.req.valid("json");

	return c.json({
		code: 1,
		error: "Solving is not implemented.",
	});
};
