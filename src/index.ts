import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { logger } from "hono/logger";
import health from "@/routes/health";
import { solveHandler, solveRoute } from "@/routes/solve";

export const app = new OpenAPIHono();

app.use(logger());

app.openapi(solveRoute, solveHandler);
app.route("/health", health);

app.doc("/docs.json", {
	openapi: "3.0.0",
	info: {
		title: "Vroom API",
		description: "A REST API for the Vroom routing engine.",
		version: "0.0.0",
	},
});

app.get("/docs", Scalar({ url: "/docs.json" }));

export default app;
