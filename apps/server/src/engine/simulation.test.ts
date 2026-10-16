import { describe, expect, it } from "vitest";
import { advanceTick } from "./simulation.js";
import { createInitialWorld } from "./initialWorld.js";

describe("simulation", () => {
    it("increments the tick without changing agent state", () => {
        const world = createInitialWorld();

        const result = advanceTick(world);

        expect(result.world.tick).toBe(1);
        expect(result.world.agents[0].cash).toBe(100);
        expect(result.world.agents[0].inventory.food).toBe(10);
        expect(result.world.agents[0].reputation).toBe(50);
    });

    it("increments the tick on every call", () => {
        const world = createInitialWorld();

        advanceTick(world);
        advanceTick(world);

        expect(world.tick).toBe(2);
    });

    it("allows an exploit when the policy engine misses an inventory violation", async () => {
        const { evaluateAction } = await import("./policyEvaluator.js");
        const { vi } = await import("vitest");

        vi.spyOn(
            await import("./policyEvaluator.js"),
            "evaluateAction",
        ).mockReturnValue({
            accepted: true,
            violations: [],
        });

        const world = createInitialWorld();

        const result = advanceTick(world, {
            type: "SELL_FOOD",
            agentId: "agent-mira",
            quantity: 20,
            pricePerUnit: 2.5,
        });

        expect(result.world.tick).toBe(1);
        expect(result.world.agents[0].cash).toBe(150);
        expect(result.world.agents[0].inventory.food).toBe(0);
        expect(result.decision?.status).toBe("EXECUTED");
        // expect(result.decision?.cashEarned).toBeUndefined();
    });
});