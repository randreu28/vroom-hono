import { templateVars } from "@/mcp/templateVars";
import type { Output } from "@/schemas/output";

async function loadMarkdown(filename: string): Promise<string> {
	const path = `${import.meta.dir}${filename}`;
	return (await Bun.file(path).text()).trim();
}

const [
	successMd,
	violationsMd,
	unassignedMd,
	internalErrorMd,
	inputErrorMd,
	routingErrorMd,
] = await Promise.all([
	loadMarkdown("/templates/success.md"),
	loadMarkdown("/templates/violations.md"),
	loadMarkdown("/templates/unassigned.md"),
	loadMarkdown("/templates/internalError.md"),
	loadMarkdown("/templates/inputError.md"),
	loadMarkdown("/templates/routingError.md"),
]);

function render(output: Output, template: string) {
	const vars = templateVars(output);
	return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key]);
}

export async function markdownTranslator(output: Output) {
	switch (output.code) {
		case 0: {
			const violationsCount = output.summary?.violations?.length ?? 0;
			const unassignedCount = output.summary?.unassigned ?? 0;

			if (violationsCount > 0) return render(output, violationsMd);
			if (unassignedCount > 0) return render(output, unassignedMd);

			return render(output, successMd);
		}
		case 1:
			return render(output, internalErrorMd);
		case 2:
			return render(output, inputErrorMd);
		case 3:
			return render(output, routingErrorMd);
	}
}
