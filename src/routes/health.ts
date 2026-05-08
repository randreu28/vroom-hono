import { Hono } from "hono";

const health = new Hono();

//TODO: Check env variables missing, throw error if missing
health.get("/health", (c) => c.json({ status: "operational" }));

export default health;
