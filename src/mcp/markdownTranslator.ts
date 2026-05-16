import type { Output } from "@/schemas/output";

async function loadMarkdown(filename: string): Promise<string> {
	return (await Bun.file(`${import.meta.dir}/${filename}`).text()).trim();
}

const [successMd, violationsMd, internalErrorMd, inputErrorMd, routingErrorMd] =
	await Promise.all([
		loadMarkdown("success.md"),
		loadMarkdown("violations.md"),
		loadMarkdown("internalError.md"),
		loadMarkdown("inputError.md"),
		loadMarkdown("routingError.md"),
	]);

export async function markdownTranslator(output: Output): Promise<string> {
	const violationsCount = output.summary?.violations?.length ?? 0;
	switch (output.code) {
		case 0:
			return violationsCount > 0 ? violationsMd : successMd;
		case 1:
			return internalErrorMd;
		case 2:
			return inputErrorMd;
		case 3:
			return routingErrorMd;
	}
}
