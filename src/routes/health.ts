import { createRoute, type RouteHandler, z } from "@hono/zod-openapi";

const healthResponseSchema = z.object({
	status: z.string(),
});

export const healthRoute = createRoute({
	method: "get",
	path: "/health",
	tags: ["Health"],
	summary: "Health check",
	description: "Lightweight liveness endpoint.",
	responses: {
		200: {
			description: "Service is operational.",
			content: {
				"application/json": {
					schema: healthResponseSchema,
					example: { status: "operational" },
				},
			},
		},
	},
});

export const healthHandler: RouteHandler<typeof healthRoute> = (c) =>
	c.json({ status: "operational" });
