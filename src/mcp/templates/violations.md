# Completed with violations

VROOM faced an issue or violation while solving the problem.

| Violation         | Count             | Description                                                                                  |
|-------------------|------------------|----------------------------------------------------------------------------------------------|
| `delay`           | `{delay}`        | Actual service start is later than the allowed time window end for a task                    |
| `lead_time`       | `{lead_time}`    | Actual service start is earlier than the allowed time window start for a task                |
| `load`            | `{load}`         | Vehicle load exceeds its capacity                                                            |
| `max_tasks`       | `{max_tasks}`    | Vehicle is assigned more tasks than the maximum allowed (`max_tasks`)                        |
| `skills`          | `{skills}`       | Vehicle does not have all required skills for an assigned task                               |
| `precedence`      | `{precedence}`   | Shipment precedence constraint is not met (e.g., `delivery` before `pickup`)                 |
| `missing_break`   | `{missing_break}`| Required vehicle break is omitted in the custom route                                        |
| `max_travel_time` | `{max_travel_time}` | Vehicle has more travel time than its maximum allowed (`max_travel_time`)               |
| `max_distance`    | `{max_distance}` | Vehicle travels a longer distance than allowed (`max_distance`)                              |
| `max_load`        | `{max_load}`     | Load during a vehicle break exceeds its allowed maximum (`max_load`)                         |


## Troubleshooting

Please check the [VROOM official documentation](https://raw.githubusercontent.com/VROOM-Project/vroom/refs/heads/master/docs/API.md) for more details.

## Raw output

```
{rawOutput}
```