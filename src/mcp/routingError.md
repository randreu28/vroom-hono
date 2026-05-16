# Routing error

VROOM faced an issue while routing the problem.

## Common causes

- At least one task (job, pickup, or delivery) could not be assigned to any route (e.g., unreachable locations, restrictive skills or capacities)
- Route violates time window constraints (delay or lead time)
- Vehicle load exceeds its `capacity`
- Vehicle exceeds its `max_tasks`, `max_travel_time`, or `max_distance` limits
- Skills required by a task are not covered by any vehicle
- A `shipment` precedence constraint is not met (`pickup` without matching `delivery`, or `delivery` before/without associated `pickup`)
- Omitted vehicle break that was required in a custom route
- Route violates `max_load` on a break
- In plan mode, the planned step order or timing violates input constraints

## Troubleshooting

Please check the [VROOM official documentation](https://raw.githubusercontent.com/VROOM-Project/vroom/refs/heads/master/docs/API.md) for more details.
