import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { logger } from "hono/logger";
import { healthHandler, healthRoute } from "@/routes/health";
import { planHandler, planRoute } from "@/routes/plan";
import { solveHandler, solveRoute } from "@/routes/solve";

export const app = new OpenAPIHono();

app.use(logger());

app.openapi(solveRoute, solveHandler);
app.openapi(planRoute, planHandler);
app.openapi(healthRoute, healthHandler);

app.doc("/docs.json", {
	openapi: "3.0.0",
	info: {
		title: "Vroom API",
		description: "A REST API for the Vroom routing engine.",
		version: "0.0.0",
	},
	tags: [
		{
			name: "Health",
			description: "Service health and readiness endpoints.",
		},
		{
			name: "Route optimization endpoints",
			description:
				"Endpoints for solving complex route optimization problems. Submit your scenario, and get optimal routes back—fast and efficient.",
		},
	],
});

app.get("/docs", Scalar({ url: "/docs.json" }));

export default app;
