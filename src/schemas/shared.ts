import { z } from "@hono/zod-openapi";

export const idSchema = z.number().int().nonnegative();

export const durationSchema = z.number().int().nonnegative();

export const locationSchema = z.tuple([z.number(), z.number()]).openapi({
	description: "Coordinates in [longitude, latitude] order.",
	example: [-90.5133, 14.6419],
});

export const locationIndexSchema = z.number().int().nonnegative();

export const quantitySchema = z.array(z.number().int().nonnegative()).min(1);

export const skillsSchema = z.array(z.number().int().nonnegative());

export const prioritySchema = z.number().int().min(0).max(100);

export const timeWindowSchema = z
	.tuple([z.number().int().nonnegative(), z.number().int().nonnegative()])
	.refine(([start, end]) => start <= end, {
		message: "time_window start must be less than or equal to end",
	})
	.openapi({
		description: "Inclusive time window as [start, end] timestamps.",
		example: [0, 14400],
	});

export const typeDurationMapSchema = z.record(z.string(), durationSchema);
