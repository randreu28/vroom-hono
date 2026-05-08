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

export const shipmentStepSchema = z
	.object({
		id: idSchema.openapi({
			description: "Unique shipment step identifier.",
			example: 1,
		}),
		description: z.string().optional().openapi({
			description: "Human-readable shipment step description.",
			example: "Pickup order #1234",
		}),
		location: locationSchema.optional(),
		location_index: locationIndexSchema.optional().openapi({
			description: "Row and column index used with custom matrices.",
			example: 0,
		}),
		setup: durationSchema.optional().openapi({
			default: 0,
			description: "Task setup duration in seconds.",
			example: 300,
		}),
		service: durationSchema.optional().openapi({
			default: 0,
			description: "Task service duration in seconds.",
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
		time_windows: z
			.array(timeWindowSchema)
			.min(1)
			.optional()
			.openapi({
				description: "Valid service-start slots for the shipment step.",
				example: [[0, 14400]],
			}),
	})
	.openapi("ShipmentStep");

export type ShipmentStep = z.infer<typeof shipmentStepSchema>;

export const shipmentSchema = z
	.object({
		pickup: shipmentStepSchema,
		delivery: shipmentStepSchema,
		amount: quantitySchema.optional().openapi({
			description: "Multidimensional quantities moved by this shipment.",
			example: [1],
		}),
		skills: skillsSchema.optional().openapi({
			default: [],
			description: "Skills required from a vehicle to perform this shipment.",
			example: [1, 2],
		}),
		priority: prioritySchema.optional().openapi({
			default: 0,
			description: "Priority level in the [0, 100] range.",
			example: 50,
		}),
	})
	.openapi("Shipment");

export type Shipment = z.infer<typeof shipmentSchema>;

export const shipmentsSchema = z.array(shipmentSchema).openapi("Shipments");

export type Shipments = z.infer<typeof shipmentsSchema>;
