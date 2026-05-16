import type { Output, Violation } from "@/schemas/output";

export function templateVars(output: Output): Record<string, string> {
	const summary = output.summary;
	return {
		cost: formatValue(summary?.cost),
		routes: formatValue(summary?.routes),
		unassigned: formatValue(summary?.unassigned),
		setup: formatValue(summary?.setup),
		service: formatValue(summary?.service),
		duration: formatValue(summary?.duration),
		waiting_time: formatValue(summary?.waiting_time),
		priority: formatValue(summary?.priority),
		delivery: formatValue(summary?.delivery),
		pickup: formatValue(summary?.pickup),
		distance: formatValue(summary?.distance),
		inputError: formatValue(
			output.error,
			"The request JSON is invalid or inconsistent with the VROOM input format.",
		),
		routingError: formatValue(
			output.error,
			"VROOM faced an issue while routing the problem.",
		),
		...violationCounts(output),
		rawOutput: JSON.stringify(output, null, 2),
	};
}

/**
 * Utility function to format values for the template,
 * With a fallback for undefined or null values.
 */
function formatValue(value: unknown, fallback = "—"): string {
	if (value === undefined || value === null) return fallback;
	if (Array.isArray(value)) return JSON.stringify(value);
	return String(value);
}

const violationCauses = [
	"delay",
	"lead_time",
	"load",
	"max_tasks",
	"skills",
	"precedence",
	"missing_break",
	"max_travel_time",
	"max_distance",
	"max_load",
] as const satisfies Violation["cause"][];

/**
 * Aggregator of all types of violations.
 * These includes violations from the summary, from each route and from each step.
 */
function allViolations(output: Output): Violation[] {
	const violations: Violation[] = [];
	if (output.summary?.violations) {
		violations.push(...output.summary.violations);
	}
	for (const route of output.routes ?? []) {
		violations.push(...route.violations);
		for (const step of route.steps) {
			violations.push(...step.violations);
		}
	}
	return violations;
}

/**
 * Counts the number of violations of each type.
 * These includes violations from the summary, from each route and from each step.
 */
function violationCounts(output: Output): Record<string, string> {
	const counts = Object.fromEntries(
		violationCauses.map((cause) => [cause, "0"]),
	);
	for (const { cause } of allViolations(output)) {
		counts[cause] = String(Number(counts[cause]) + 1);
	}
	return counts;
}
