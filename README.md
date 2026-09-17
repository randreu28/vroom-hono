# Vroom API

HTTP API and MCP server in front of [VROOM](https://github.com/VROOM-Project/vroom), with fully OpenAPI-compliant documentation. You post vehicles, jobs, and shipments. It returns routes. Travel times come from OSRM.


## How to run

```sh
docker compose up --build
```

The first build downloads the map and preprocesses it, so it takes a while.

When it is up, open <http://localhost:3000/docs> to see the API documentation.
You may also connect to the MCP server at <http://localhost:3000/mcp>.


## Changing the map

The default extract is Catalunya, hardcoded in `Dockerfile.Osrm`. To change region, pick a `.osm.pbf` from [Geofabrik](https://download.geofabrik.de/), then replace the wget URL and every `cataluna-latest` filename in extract, partition, customize, and the `CMD`. Rebuild after that.

Bigger extracts make a chunkier container: longer download, more RAM while OSRM builds the graph, and a heavier image to run.
