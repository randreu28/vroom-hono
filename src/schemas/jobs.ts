import { z } from "@hono/zod-openapi";
import {
	durationSchema,
	idSchema,
	locationIndexSchema,
	locationSchema,
	prioritySchema,
	quantitySchema,
	skillsSchema,
	timeWindowSchema,
	typeDurationMapSchema,
} from "@/schemas/shared";

export const jobSchema = z
	.object({
		id: idSchema.openapi({
			description: "Unique job identifier.",
			example: 1,
		}),
		description: z.string().optional().openapi({
			description: "Human-readable job description.",
			example: "Deliver order #1234",
		}),
		location: locationSchema.optional(),
		location_index: locationIndexSchema.optional().openapi({
			description: "Row and column index used with custom matrices.",
			example: 0,
		}),
		setup: durationSchema.optional().openapi({
			default: 0,
			description: "Job setup duration in seconds.",
			example: 300,
		}),
		service: durationSchema.optional().openapi({
			default: 0,
			description: "Job service duration in seconds.",
			example: 600,
		}),
		setup_per_type: typeDurationMapSchema.optional().openapi({
			description: "Setup duration override by vehicle type.",
			example: { bike: 180, car: 300 },
		}),
		service_per_type: typeDurationMapSchema.optional().openapi({
			description: "Service duration override by vehicle type.",
			example: { bike: 480, car: 600 },
		}),
		delivery: quantitySchema.optional().openapi({
			description: "Multidimensional quantities delivered by this job.",
			example: [1],
		}),
		pickup: quantitySchema.optional().openapi({
			description: "Multidimensional quantities picked up by this job.",
			example: [1],
		}),
		skills: skillsSchema.optional().openapi({
			default: [],
			description: "Skills required from a vehicle to perform this job.",
			example: [1, 2],
		}),
		priority: prioritySchema.optional().openapi({
			default: 0,
			description: "Priority level in the [0, 100] range.",
			example: 50,
		}),
		time_windows: z
			.array(timeWindowSchema)
			.min(1)
			.optional()
			.openapi({
				description: "Valid service-start slots for the job.",
				example: [[0, 14400]],
			}),
	})
	.openapi("Job");

export type Job = z.infer<typeof jobSchema>;

export const jobsSchema = z.array(jobSchema).openapi("Jobs");

export type Jobs = z.infer<typeof jobsSchema>;
