import { createRoute, type RouteHandler } from "@hono/zod-openapi";
import { healthResponseSchema } from "@/schemas/requests";

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
