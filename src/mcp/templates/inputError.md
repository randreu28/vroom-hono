# Input error

{inputError}

## Common causes

- Duplicate `id` on jobs, shipment steps, or vehicle breaks
- Missing `location` on jobs/vehicles when no custom `matrices` are provided
- Missing `location_index` when custom matrices are provided
- Coordinates in wrong order — use `[lon, lat]`, not lat/lon
- Vehicle missing both `start` and `end` when at least one is required
- Non-default `costs.per_hour` combined with a custom `costs` matrix
- Invalid `vehicles[].steps` route (plan mode or forced initial solution)
- `location_index` out of range for the profile matrix

## Troubleshooting

Please check the [VROOM official documentation](https://raw.githubusercontent.com/VROOM-Project/vroom/refs/heads/master/docs/API.md) for more details.

## Raw output

```
{rawOutput}
```
