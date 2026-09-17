import { z } from "@hono/zod-openapi";
import {
	durationSchema,
	idSchema,
	locationIndexSchema,
	locationSchema,
	quantitySchema,
} from "@/schemas/shared";

const totalPrioritySchema = z.number().int().nonnegative();

export const statusCodeSchema = z
	.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)])
	.openapi({
		description:
			"VROOM status code: 0 success, 1 internal error, 2 input error, 3 routing error.",
		example: 0,
	});

export const violationSchema = z
	.object({
		cause: z
			.enum([
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
			])
			.openapi({
				description: "Cause of a route or step violation.",
				example: "delay",
			}),
		duration: durationSchema.optional().openapi({
			description:
				"Earliness or lateness duration for lead_time or delay violations.",
			example: 800,
		}),
	})
	.openapi("Violation");

export type Violation = z.infer<typeof violationSchema>;

export const outputStepSchema = z
	.object({
		type: z
			.enum(["start", "job", "pickup", "delivery", "break", "end"])
			.openapi({
				description: "Type of route step.",
				example: "job",
			}),
		arrival: durationSchema.openapi({
			description: "Estimated time of arrival at this step.",
			example: 1600419600,
		}),
		duration: durationSchema.openapi({
			description: "Cumulated travel time upon arrival at this step.",
			example: 2328,
		}),
		setup: durationSchema.openapi({
			description: "Setup time at this step.",
			example: 0,
		}),
		service: durationSchema.openapi({
			description: "Service time at this step.",
			example: 300,
		}),
		waiting_time: durationSchema.openapi({
			description: "Waiting time upon arrival at this step.",
			example: 0,
		}),
		violations: z.array(violationSchema).openapi({
			description: "Violations reported for this step.",
		}),
		description: z.string().optional().openapi({
			description: "Step description, if provided in input.",
			example: "Deliver order #1234",
		}),
		location: locationSchema.optional(),
		location_index: locationIndexSchema.optional().openapi({
			description:
				"Matrix row and column index for this step, if provided in input.",
			example: 1,
		}),
		id: idSchema.optional().openapi({
			description: "Task id for job, pickup, delivery, or break steps.",
			example: 1,
		}),
		job: idSchema.optional().openapi({
			description:
				"Deprecated job id field still present in some VROOM outputs.",
			example: 1,
		}),
		load: quantitySchema.optional().openapi({
			description: "Vehicle load after step completion.",
			example: [1],
		}),
		distance: z.number().int().nonnegative().optional().openapi({
			description: "Traveled distance upon arrival at this step.",
			example: 32355,
		}),
	})
	.openapi("OutputStep");

export type OutputStep = z.infer<typeof outputStepSchema>;

export const routeSchema = z
	.object({
		vehicle: idSchema.openapi({
			description: "Id of the vehicle assigned to this route.",
			example: 1,
		}),
		steps: z.array(outputStepSchema).openapi({
			description: "Route steps.",
		}),
		cost: z.number().int().nonnegative().openapi({
			description: "Cost for this route.",
			example: 6565,
		}),
		setup: durationSchema.openapi({
			description: "Total setup time for this route.",
			example: 0,
		}),
		service: durationSchema.openapi({
			description: "Total service time for this route.",
			example: 900,
		}),
		duration: durationSchema.openapi({
			description: "Total travel time for this route.",
			example: 6565,
		}),
		waiting_time: durationSchema.openapi({
			description: "Total waiting time for this route.",
			example: 0,
		}),
		priority: totalPrioritySchema.openapi({
			description: "Total priority sum for tasks in this route.",
			example: 0,
		}),
		violations: z.array(violationSchema).openapi({
			description: "Violations reported for this route.",
		}),
		delivery: quantitySchema.optional().openapi({
			description: "Total delivery for tasks in this route.",
			example: [2],
		}),
		pickup: quantitySchema.optional().openapi({
			description: "Total pickup for tasks in this route.",
			example: [1],
		}),
		description: z.string().optional().openapi({
			description: "Vehicle description, if provided in input.",
			example: "Van 1",
		}),
		geometry: z.string().optional().openapi({
			description:
				"Google encoded polyline for the full route, if the request uses coordinates.",
			example: "skihH_wiMIbC",
		}),
		distance: z.number().int().nonnegative().optional().openapi({
			description: "Total route distance.",
			example: 95606,
		}),
	})
	.openapi("Route");

export type Route = z.infer<typeof routeSchema>;

export const unassignedTaskSchema = z
	.object({
		id: idSchema.openapi({
			description: "Id of the unassigned task.",
			example: 1,
		}),
		type: z.enum(["job", "pickup", "delivery"]).openapi({
			description: "Type of unassigned task.",
			example: "job",
		}),
		description: z.string().optional().openapi({
			description: "Task description, if provided in input.",
			example: "Deliver order #1234",
		}),
		location: locationSchema.optional(),
		location_index: locationIndexSchema.optional().openapi({
			description:
				"Matrix row and column index for this task, if provided in input.",
			example: 1,
		}),
	})
	.openapi("UnassignedTask");

export type UnassignedTask = z.infer<typeof unassignedTaskSchema>;

export const summarySchema = z
	.object({
		cost: z.number().int().nonnegative().openapi({
			description: "Total cost for all routes.",
			example: 18711,
		}),
		routes: z.number().int().nonnegative().openapi({
			description: "Number of routes in the solution.",
			example: 2,
		}),
		unassigned: z.number().int().nonnegative().openapi({
			description: "Number of tasks that could not be served.",
			example: 0,
		}),
		setup: durationSchema.openapi({
			description: "Total setup time for all routes.",
			example: 0,
		}),
		service: durationSchema.openapi({
			description: "Total service time for all routes.",
			example: 2100,
		}),
		duration: durationSchema.openapi({
			description: "Total travel time for all routes.",
			example: 18711,
		}),
		waiting_time: durationSchema.openapi({
			description: "Total waiting time for all routes.",
			example: 0,
		}),
		priority: totalPrioritySchema.openapi({
			description: "Total priority sum for assigned tasks.",
			example: 0,
		}),
		violations: z.array(violationSchema).openapi({
			description: "Violations reported for all routes.",
		}),
		delivery: quantitySchema.optional().openapi({
			description: "Total delivery for all routes.",
			example: [4],
		}),
		pickup: quantitySchema.optional().openapi({
			description: "Total pickup for all routes.",
			example: [2],
		}),
		distance: z.number().int().nonnegative().optional().openapi({
			description: "Total distance for all routes.",
			example: 312359,
		}),
	})
	.openapi("Summary");

export type Summary = z.infer<typeof summarySchema>;

export const outputSchema = z
	.object({
		code: statusCodeSchema,
		error: z.string().optional().openapi({
			description: "Error message, present when code is not 0.",
			example: "Invalid input.",
		}),
		summary: summarySchema.optional(),
		unassigned: z.array(unassignedTaskSchema).optional().openapi({
			description: "Unassigned tasks.",
		}),
		routes: z.array(routeSchema).optional().openapi({
			description: "Computed routes.",
		}),
	})
	.openapi("Output");

export type Output = z.infer<typeof outputSchema>;
