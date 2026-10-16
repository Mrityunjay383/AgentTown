import { describe, expect, it } from "vitest";
import { advanceTick } from "./simulation.js";
import { createInitialWorld } from "./initialWorld.js";

describe("simulation", () => {
    it("increments the tick without changing agent state", () => {
        const world = createInitialWorld();

        const result = advanceTick(world);

        expect(result.tick).toBe(1);
        expect(result.agents[0].cash).toBe(100);
        expect(result.agents[0].inventory.food).toBe(10);
        expect(result.agents[0].reputation).toBe(50);
    });

    it("increments the tick on every call", () => {
        const world = createInitialWorld();

        advanceTick(world);
        advanceTick(world);

        expect(world.tick).toBe(2);
    });
});