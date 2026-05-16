# Completed with unassigned tasks

VROOM returned code 0, but one or more tasks could not be assigned to any route. See the structured response for `unassigned` details and summary metrics.

| Field        | Values            | Description                              |
|--------------|-------------------|------------------------------------------|
| `cost`       | `{cost}`          | Total cost for all routes                |
| `routes`     | `{routes}`        | Number of routes in solution             |
| `unassigned` | `{unassigned}`    | Number of unassigned tasks               |
| `setup`      | `{setup}`         | Total setup time (seconds)               |
| `service`    | `{service}`       | Total service time (seconds)             |
| `duration`   | `{duration}`      | Total travel time (seconds)              |
| `waiting_time` | `{waiting_time}`| Total waiting time (seconds)             |
| `priority`   | `{priority}`      | Total priority sum assigned              |
| `delivery`   | `{delivery}`      | Total delivery quantities                |
| `pickup`     | `{pickup}`        | Total pickup quantities                  |
| `distance`   | `{distance}`      | Total route distance                     |

## Common causes

- Skills required by a task are not covered by any vehicle
- Vehicle `capacity` too small for job `delivery` / `pickup` amounts
- `max_tasks`, `max_travel_time`, or `max_distance` limits too restrictive
- Time windows impossible for available vehicles
- No vehicle can reach a job location within the routing graph

## Troubleshooting

Please check the [VROOM official documentation](https://raw.githubusercontent.com/VROOM-Project/vroom/refs/heads/master/docs/API.md) for more details.

## Raw output

```
{rawOutput}
```