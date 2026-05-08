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
					description: "Catalunya van",
					// Note: API expects [longitude, latitude]
					start: [2.1686, 41.3874],
					end: [2.1686, 41.3874],
					time_window: [0, 43200],
				},
			],
			jobs: [
				{
					id: 101,
					description: "Pickup near Sagrada Família (Barcelona)",
					location: [2.1744, 41.4036],
					service: 600,
				},
				{
					id: 102,
					description: "Stop in Girona",
					location: [2.8214, 41.9794],
					service: 900,
				},
				{
					id: 103,
					description: "Stop in Tarragona",
					location: [1.2445, 41.1189],
					service: 900,
				},
				{
					id: 104,
					description: "Stop in Lleida",
					location: [0.6222, 41.6176],
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

