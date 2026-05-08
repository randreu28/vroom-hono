import { createRoute, type RouteHandler, z } from "@hono/zod-openapi";

const locationSchema = z
	.tuple([z.number(), z.number()])
	.openapi({ example: [2.1734, 41.3851] });

const vehicleSchema = z.object({
	id: z.number().int().nonnegative().openapi({ example: 1 }),
	start: locationSchema,
	end: locationSchema.optional(),
});

const jobSchema = z.object({
	id: z.number().int().nonnegative().openapi({ example: 1 }),
	location: locationSchema,
});

const solveRequestSchema = z.object({
	vehicles: z.array(vehicleSchema).min(1),
	jobs: z.array(jobSchema).min(1),
});

const solveResponseSchema = z.object({
	ok: z.boolean(),
	request: solveRequestSchema,
});

export const solveRoute = createRoute({
	method: "post",
	path: "/solve",
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
					schema: solveResponseSchema,
				},
			},
			description: "Validated request payload (no solving performed).",
		},
	},
});

export const solveHandler: RouteHandler<typeof solveRoute> = (c) => {
	const request = c.req.valid("json");
	return c.json({ ok: true, request });
};
