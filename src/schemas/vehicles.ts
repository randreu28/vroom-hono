import { z } from "@hono/zod-openapi";
import {
	durationSchema,
	idSchema,
	locationIndexSchema,
	locationSchema,
	quantitySchema,
	skillsSchema,
	timeWindowSchema,
} from "@/schemas/shared";

export const vehicleCostsSchema = z
	.object({
		fixed: z.number().int().nonnegative().optional().openapi({
			default: 0,
			description: "Fixed cost for using this vehicle.",
			example: 0,
		}),
		per_hour: z.number().int().nonnegative().optional().openapi({
			default: 3600,
			description: "Cost for one hour of travel time.",
			example: 3600,
		}),
		per_task_hour: z.number().int().nonnegative().optional().openapi({
			default: 0,
			description: "Cost for one hour of task time.",
			example: 0,
		}),
		per_km: z.number().int().nonnegative().optional().openapi({
			default: 0,
			description: "Cost for one kilometer of travel distance.",
			example: 0,
		}),
	})
	.openapi("VehicleCosts");

export type VehicleCosts = z.infer<typeof vehicleCostsSchema>;

export const vehicleBreakSchema = z
	.object({
		id: idSchema.openapi({
			description: "Unique break identifier for this vehicle.",
			example: 1,
		}),
		time_windows: z
			.array(timeWindowSchema)
			.min(1)
			.optional()
			.openapi({
				description: "Valid slots for break start.",
				example: [[14400, 18000]],
			}),
		service: durationSchema.optional().openapi({
			default: 0,
			description: "Break duration in seconds.",
			example: 1800,
		}),
		description: z.string().optional().openapi({
			description: "Human-readable break description.",
			example: "Lunch break",
		}),
		max_load: quantitySchema.optional().openapi({
			description: "Maximum vehicle load for which this break can happen.",
			example: [10],
		}),
	})
	.openapi("VehicleBreak");

export type VehicleBreak = z.infer<typeof vehicleBreakSchema>;

export const vehicleStepSchema = z
	.object({
		type: z
			.enum(["start", "job", "pickup", "delivery", "break", "end"])
			.openapi({
				description: "Type of custom route step.",
				example: "job",
			}),
		id: idSchema.optional().openapi({
			description: "Task id for job, pickup, delivery, or break steps.",
			example: 1,
		}),
		service_at: durationSchema.optional().openapi({
			description: "Hard constraint on service time.",
			example: 3600,
		}),
		service_after: durationSchema.optional().openapi({
			description: "Hard lower bound on service time.",
			example: 1800,
		}),
		service_before: durationSchema.optional().openapi({
			description: "Hard upper bound on service time.",
			example: 7200,
		}),
	})
	.openapi("VehicleStep");

export type VehicleStep = z.infer<typeof vehicleStepSchema>;

export const vehicleSchema = z
	.object({
		id: idSchema.openapi({
			description: "Unique vehicle identifier.",
			example: 1,
		}),
		profile: z.string().optional().openapi({
			default: "car",
			description: "Routing profile.",
			example: "car",
		}),
		description: z.string().optional().openapi({
			description: "Human-readable vehicle description.",
			example: "Van 1",
		}),
		start: locationSchema.optional(),
		start_index: locationIndexSchema.optional().openapi({
			description: "Start row and column index used with custom matrices.",
			example: 0,
		}),
		end: locationSchema.optional(),
		end_index: locationIndexSchema.optional().openapi({
			description: "End row and column index used with custom matrices.",
			example: 0,
		}),
		capacity: quantitySchema.optional().openapi({
			description: "Multidimensional vehicle capacity.",
			example: [10],
		}),
		costs: vehicleCostsSchema.optional(),
		skills: skillsSchema.optional().openapi({
			default: [],
			description: "Skills available on this vehicle.",
			example: [1, 2],
		}),
		type: z.string().optional().openapi({
			description: "Vehicle type used by setup/service per-type overrides.",
			example: "car",
		}),
		time_window: timeWindowSchema.optional(),
		breaks: z.array(vehicleBreakSchema).min(1).optional(),
		speed_factor: z.number().positive().max(5).optional().openapi({
			default: 1,
			description: "Travel-time scaling factor in the (0, 5] range.",
			example: 1,
		}),
		max_tasks: z.number().int().nonnegative().optional().openapi({
			description: "Maximum number of tasks in this vehicle route.",
			example: 10,
		}),
		max_travel_time: durationSchema.optional().openapi({
			description: "Maximum travel time in seconds for this vehicle.",
			example: 28800,
		}),
		max_distance: z.number().int().nonnegative().optional().openapi({
			description: "Maximum route distance in meters for this vehicle.",
			example: 100000,
		}),
		steps: z.array(vehicleStepSchema).min(1).optional().openapi({
			description:
				"Custom route description for plan mode or initial solving route.",
		}),
	})
	.openapi("Vehicle");

export type Vehicle = z.infer<typeof vehicleSchema>;

export const vehiclesSchema = z.array(vehicleSchema).min(1).openapi("Vehicles");

export type Vehicles = z.infer<typeof vehiclesSchema>;
