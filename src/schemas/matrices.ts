import { z } from "@hono/zod-openapi";

const matrixValueSchema = z.number().int().nonnegative();

export const matrixProfileSchema = z
	.array(z.array(matrixValueSchema).min(1))
	.min(1);

export const matrixSchema = z
	.object({
		durations: matrixProfileSchema.optional().openapi({
			description: "Custom travel-time matrix in seconds.",
			example: [
				[0, 14],
				[21, 0],
			],
		}),
		distances: matrixProfileSchema.optional().openapi({
			description: "Custom distance matrix in meters. Requires durations.",
			example: [
				[0, 1000],
				[1500, 0],
			],
		}),
		costs: matrixProfileSchema.optional().openapi({
			description: "Custom cost matrix used for route cost evaluations.",
			example: [
				[0, 14],
				[21, 0],
			],
		}),
	})
	.openapi("ProfileMatrix");

export type Matrix = z.infer<typeof matrixSchema>;

export const matricesSchema = z
	.record(z.string(), matrixSchema)
	.openapi("Matrices");

export type Matrices = z.infer<typeof matricesSchema>;
