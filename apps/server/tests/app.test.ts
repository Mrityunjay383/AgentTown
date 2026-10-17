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
