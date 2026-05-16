# Completed with violations

VROOM faced an issue or violation while solving the problem.

## Possible violations

- `delay` if actual service start does not meet a task time window and is late on a time window end
- `lead_time` if actual service start does not meet a task time window and is early on a time window start
- `load` if the vehicle load goes over its capacity
- `max_tasks` if the vehicle has more tasks than its `max_tasks` value
- `skills` if the vehicle does not hold all required skills for a task
- `precedence` if a `shipment` precedence constraint is not met (`pickup` without matching `delivery`, `delivery` before/without matching `pickup`)
- `missing_break` if a vehicle break has been omitted in its custom route
- `max_travel_time` if the vehicle has more travel time than its `max_travel_time` value
- `max_distance` if the vehicle has a longer travel distance than its `max_distance` value
- `max_load` if the load during a break exceed its `max_load` value

## Troubleshooting

Please check the [VROOM official documentation](https://raw.githubusercontent.com/VROOM-Project/vroom/refs/heads/master/docs/API.md) for more details.
