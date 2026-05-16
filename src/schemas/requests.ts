import { z } from "@hono/zod-openapi";
import { jobsSchema } from "@/schemas/jobs";
import { matricesSchema } from "@/schemas/matrices";
import { shipmentsSchema } from "@/schemas/shipments";
import {
	vehicleSchema,
	vehicleStepSchema,
	vehiclesSchema,
} from "@/schemas/vehicles";

export const solveRequestSchema = z.object({
	vehicles: vehiclesSchema,
	jobs: jobsSchema.optional(),
	shipments: shipmentsSchema.optional(),
	matrices: matricesSchema.optional(),
});

export const planRequestSchema = z.object({
	vehicles: z
		.array(
			vehicleSchema.extend({
				steps: z.array(vehicleStepSchema).min(1).openapi({
					description: "Required custom route description in plan mode.",
				}),
			}),
		)
		.min(1),
	jobs: jobsSchema.optional(),
	shipments: shipmentsSchema.optional(),
	matrices: matricesSchema.optional(),
});

export const healthResponseSchema = z.object({
	status: z.string(),
});
