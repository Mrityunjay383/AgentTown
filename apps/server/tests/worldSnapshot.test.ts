import { describe, expect, it } from "vitest";
import { createInitialWorld } from "../src/engine/initialWorld.js";
import { createWorldSnapshot } from "../src/engine/worldSnapshot.js";

describe("world snapshot", () => {
    it("remains unchanged when the live world is modified", () => {
        const world = createInitialWorld();
        const snapshot = createWorldSnapshot(world);

        world.tick = 1;
        world.agents[0].cash = 200;
        world.agents[0].inventory.food = 5;

        expect(snapshot.tick).toBe(0);
        expect(snapshot.agents[0].cash).toBe(100);
        expect(snapshot.agents[0].inventory.food).toBe(10);
    });
});