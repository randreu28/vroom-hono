import { expect, test } from "bun:test";

test("/solve happy path (e2e)", async () => {
	const res = await fetch("http://localhost:3000/solve", {
		method: "POST",
		headers: {
			"content-type": "application/json",
		},
		body: JSON.stringify({
			vehicles: [
				{
					id: 1,
					profile: "car",
					description: "Guatemala van",
					// Note: API expects [longitude, latitude]
					start: [-90.5133, 14.6419],
					end: [-90.5133, 14.6419],
					time_window: [0, 43200],
				},
			],
			jobs: [
				{
					id: 101,
					description: "Pickup in Antigua",
					location: [-90.7344, 14.5586],
					service: 600,
				},
				{
					id: 102,
					description: "Stop in Quetzaltenango",
					location: [-91.5189, 14.8347],
					service: 900,
				},
				{
					id: 103,
					description: "Stop in Escuintla",
					location: [-90.785, 14.305],
					service: 900,
				},
				{
					id: 104,
					description: "Stop in Puerto Barrios",
					location: [-88.5947, 15.7278],
					service: 900,
				},
			],
		}),
	});

	const data = await res.json();

	console.log(data);
	console.log(res.status);
	expect(res.status).toBe(200);
});

test("/solve rejects invalid payload (schema validation) (e2e)", async () => {
	const res = await fetch("http://localhost:3000/solve", {
		method: "POST",
		headers: {
			"content-type": "application/json",
		},
		body: JSON.stringify({
			vehicles: [
				{
					id: 1,
					start: [-90.5133, 14.6419],
					end: [-90.5133, 14.6419],
					// invalid: start > end
					time_window: [100, 0],
				},
			],
		}),
	});

	expect(res.status).toBe(400);
});

test("/solve returns vroom input error for semantically invalid request (e2e)", async () => {
	const res = await fetch("http://localhost:3000/solve", {
		method: "POST",
		headers: {
			"content-type": "application/json",
		},
		body: JSON.stringify({
			vehicles: [
				{
					id: 1,
					start: [-90.5133, 14.6419],
					end: [-90.5133, 14.6419],
					time_window: [0, 43200],
				},
			],
			// schema allows location to be omitted, but VROOM should reject it
			jobs: [{ id: 101, service: 600 }],
		}),
	});

	const data = await res.json();
	expect(res.status).toBe(400);
	expect(data.code).toBe(2);
	expect(typeof data.error).toBe("string");
});

test("/solve rejects malformed JSON (e2e)", async () => {
	const res = await fetch("http://localhost:3000/solve", {
		method: "POST",
		headers: {
			"content-type": "application/json",
		},
		body: "{",
	});

	expect(res.status).toBeGreaterThanOrEqual(400);
});

