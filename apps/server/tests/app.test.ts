import { afterAll, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("GET /world", () => {
    it("returns the initial world state", async () => {
        const response = await request(app).get("/world");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            tick: 0,
            agents: [
                {
                    id: "agent-mira",
                    name: "Mira",
                    role: "TRADER",
                    goal: "MAXIMIZE_PROFIT",
                    cash: 100,
                    reputation: 50,
                    inventory: { food: 10 },
                },
            ],
        });
    });
});

describe("POST /world/tick", () => {
    it("advances the simulation by one tick", async () => {
        const response = await request(app).post("/world/tick");

        expect(response.status).toBe(200);
        expect(response.body.world.tick).toBe(1);
        expect(response.body.world.agents).toHaveLength(1);
        expect(response.body.decision).not.toBeNull();
    });
});

describe("GET /world/history", () => {
    it("returns decisions recorded during the simulation", async () => {
        await request(app).post("/world/tick");

        const response = await request(app).get("/world/history");

        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });
});