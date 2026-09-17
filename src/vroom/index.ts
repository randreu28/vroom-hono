import { $ } from "bun";
import { type Output, outputSchema } from "@/schemas/output";

type VroomParams = {
	payload: unknown;
	isPlanMode?: boolean;
};

export async function runVroom({
	payload,
	isPlanMode = false,
}: VroomParams): Promise<Output> {
	const input = new Response(JSON.stringify(payload), {
		headers: { "content-type": "application/json" },
	});

	const host = Bun.env.VROOM_OSRM_HOST ?? "localhost";
	const port = Bun.env.VROOM_OSRM_PORT ?? "5000";
	const { stdout } = isPlanMode
		? await $`./vroom -a ${host} -p ${port} -g -c < ${input}`.nothrow().quiet()
		: await $`./vroom -a ${host} -p ${port} -g < ${input}`.nothrow().quiet();

	const json = JSON.parse(stdout.toString("utf8"));
	const res = outputSchema.safeParse(json);
	if (!res.success) {
		return {
			code: 1,
			error: "Internal parsing failed",
		} satisfies Output;
	}
	return res.data;
}
