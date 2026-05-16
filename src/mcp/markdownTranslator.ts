import type { Output } from "@/schemas/output";

export function markdownTranslator(output: Output): string {
	const violationsCount = output.summary?.violations?.length ?? 0;
	switch (output.code) {
		case 0:
			if (violationsCount > 0) {
				return `
				# Completed with violations

				VROOM faced an issue or violation while solving the problem. 

				## Possible violations

				- \`delay\` if actual service start does not meet a task time window and is late on a time window end
				- \`lead_time\` if actual service start does not meet a task time window and is early on a time window start
				- \`load\` if the vehicle load goes over its capacity
				- \`max_tasks\` if the vehicle has more tasks than its \`max_tasks\` value
				- \`skills\` if the vehicle does not hold all required skills for a task
				- \`precedence\` if a \`shipment\` precedence constraint is not met (\`pickup\` without matching \`delivery\`, \`delivery\` before/without matching \`pickup\`)
				- \`missing_break\` if a vehicle break has been omitted in its custom route
				- \`max_travel_time\` if the vehicle has more travel time than its \`max_travel_time\` value
				- \`max_distance\` if the vehicle has a longer travel distance than its \`max_distance\` value
				- \`max_load\` if the load during a break exceed its \`max_load\` value

				
				## Troubleshooting
				
				Please check the [VROOM officiall documentation](https://raw.githubusercontent.com/VROOM-Project/vroom/refs/heads/master/docs/API.md) 
				for more details.
			`.trim();
			}

			return `
					# Success

					VROOM completed with no violations. See the structured response for routes, steps, and summary metrics.
				`.trim();

		case 1:
			return `
				# Internal error

				VROOM failed unexpectedly while solving the problem. This is not under your control
				Please try again later.
			`.trim();
		case 2:
			return `
				# Input error

				The request JSON is invalid or inconsistent with the VROOM input format.

				## Common causes

				- Duplicate \`id\` on jobs, shipment steps, or vehicle breaks
				- Missing \`location\` on jobs/vehicles when no custom \`matrices\` are provided
				- Missing \`location_index\` when custom matrices are provided
				- Coordinates in wrong order — use \`[lon, lat]\`, not lat/lon
				- Vehicle missing both \`start\` and \`end\` when at least one is required
				- Non-default \`costs.per_hour\` combined with a custom \`costs\` matrix
				- Invalid \`vehicles[].steps\` route (plan mode or forced initial solution)
				- \`location_index\` out of range for the profile matrix

				## Troubleshooting

				Please check the [VROOM officiall documentation](https://raw.githubusercontent.com/VROOM-Project/vroom/refs/heads/master/docs/API.md) 
				for more details.
			`.trim();
		case 3:
			return `
				# Routing error

				VROOM faced an issue while routing the problem. 

				## Common causes

				- At least one task (job, pickup, or delivery) could not be assigned to any route (e.g., unreachable locations, restrictive skills or capacities)
				- Route violates time window constraints (delay or lead time)
				- Vehicle load exceeds its \`capacity\`
				- Vehicle exceeds its \`max_tasks\`, \`max_travel_time\`, or \`max_distance\` limits
				- Skills required by a task are not covered by any vehicle
				- A \`shipment\` precedence constraint is not met (\`pickup\` without matching \`delivery\`, or \`delivery\` before/without associated \`pickup\`)
				- Omitted vehicle break that was required in a custom route
				- Route violates \`max_load\` on a break
				- In plan mode, the planned step order or timing violates input constraints

				## Troubleshooting

				Please check the [VROOM official documentation](https://raw.githubusercontent.com/VROOM-Project/vroom/refs/heads/master/docs/API.md) 
				for more details.
			`.trim();
	}
}
