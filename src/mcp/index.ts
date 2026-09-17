import { createMcpHandler, McpServer } from "@modelcontextprotocol/server";
import { markdownTranslator } from "@/mcp/markdownTranslator";
import { outputSchema } from "@/schemas/output";
import {
	healthResponseSchema,
	planRequestSchema,
	solveRequestSchema,
} from "@/schemas/requests";
import { runVroom } from "@/vroom";

export default createMcpHandler(() => {
	const mcp = new McpServer(
		{ name: "Vroom MCP", version: "1.0.0" },
		{
			instructions: `
			The VROOM MCP server provides tools for solving vehicle routing problems.
			Use it to optimize vehicle routes and shipments.
		`,
		},
	);

	mcp.registerTool(
		"vroom_solve",
		{
			title: "Solve",
			description: `
			The default solving mode takes as input the description of a vehicle routing
			problem and outputs a set of routes matching all constraints.
		`,
			inputSchema: solveRequestSchema,
			outputSchema: outputSchema,
		},
		async (input) => {
			const output = await runVroom({ payload: input });
			const markdown = await markdownTranslator(output);

			return {
				content: [{ type: "text", text: markdown }],
				structuredContent: output,
				isError: output.code !== 0,
			};
		},
	);

	mcp.registerTool(
		"vroom_plan",
		{
			title: "Plan",
			description: `
			Compute ETA for a user-provided route plan. 
			All constraints are treated as soft constraints and violations are reported.
		`,
			inputSchema: planRequestSchema,
			outputSchema: outputSchema,
		},
		async (input) => {
			const output = await runVroom({ payload: input, isPlanMode: true });
			const markdown = await markdownTranslator(output);
			return {
				content: [{ type: "text", text: markdown }],
				structuredContent: output,
				isError: output.code !== 0,
			};
		},
	);

	mcp.registerTool(
		"vroom_health",
		{
			title: " Health status",
			description: "Check whether the VROOM MCP server is operational.",
			outputSchema: healthResponseSchema,
		},
		async () => ({
			content: [{ type: "text", text: "The VROOM MCP server is operational." }],
			structuredContent: { status: "operational" },
		}),
	);

	return mcp;
});
