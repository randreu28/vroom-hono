import { createMcpHonoApp } from "@modelcontextprotocol/hono";
import {
	type CallToolResult,
	McpServer,
	WebStandardStreamableHTTPServerTransport,
} from "@modelcontextprotocol/server";
import { type Output, outputSchema } from "@/schemas/output";
import {
	healthResponseSchema,
	planRequestSchema,
	solveRequestSchema,
} from "@/schemas/requests";
import { runVroom } from "@/vroom";

function vroomToolResult(output: Output): CallToolResult {
	return {
		content: [{ type: "text", text: JSON.stringify(output) }],
		structuredContent: output,
		isError: output.code !== 0,
	};
}

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
	async (input) => vroomToolResult(await runVroom({ payload: input })),
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
	async (input) =>
		vroomToolResult(await runVroom({ payload: input, isPlanMode: true })),
);

mcp.registerTool(
	"vroom_health",
	{
		title: "VROOM Health",
		description: "Check whether the VROOM MCP server is operational.",
		outputSchema: healthResponseSchema,
	},
	async () => ({
		content: [{ type: "text", text: "The VROOM MCP server is operational." }],
		structuredContent: { status: "operational" },
	}),
);

const transport = new WebStandardStreamableHTTPServerTransport();
await mcp.connect(transport);
const mcpServer = createMcpHonoApp();
mcpServer.all("/", (c) => transport.handleRequest(c.req.raw));

export default mcpServer;
