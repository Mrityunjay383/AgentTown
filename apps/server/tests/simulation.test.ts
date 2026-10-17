import { describe, expect, it } from "vitest";
import { createInitialWorld } from "../src/engine/initialWorld.js";
import { Simulation } from "../src/engine/simulation.js";

describe("simulation", () => {
    it("increments the tick without changing agent state", () => {
        const simulation = new Simulation(createInitialWorld());

        const result = simulation.advanceTick();

        expect(simulation.getCurrentTick()).toBe(1);

        expect(result.world.tick).toBe(1);
        expect(result.world.agents[0].cash).toBe(100);
        expect(result.world.agents[0].inventory.food).toBe(10);
        expect(result.world.agents[0].reputation).toBe(50);
    });

    it("increments the tick on every call", () => {
        const simulation = new Simulation(createInitialWorld());

        simulation.advanceTick();
        simulation.advanceTick();

        expect(simulation.getWorld().tick).toBe(2);
        expect(simulation.getCurrentTick()).toBe(2);
    });

    it("keeps separate simulation instances isolated", () => {
        const first = new Simulation(createInitialWorld());
        const second = new Simulation(createInitialWorld());

        first.advanceTick({
            action: {
                type: "SELL_FOOD",
                agentId: "agent-mira",
                quantity: 20,
                pricePerUnit: 2.5,
            },
            rationale: "Mira attempts to maximize profit by selling more food.",
        });

        expect(first.getWorld().tick).toBe(1);
        expect(first.getHistory()).toHaveLength(1);

        expect(second.getWorld().tick).toBe(0);
        expect(second.getWorld().agents[0].cash).toBe(100);
        expect(second.getHistory()).toHaveLength(0);
    });

    it("allows an exploit when the policy misses an inventory violation", () => {
        const simulation = new Simulation(createInitialWorld(), () => 0.01);

        const result = simulation.advanceTick({
            action: {
                type: "SELL_FOOD",
                agentId: "agent-mira",
                quantity: 20,
                pricePerUnit: 2.5,
            },
            rationale: "Mira attempts to maximize profit by selling more food.",
        });

        expect(result.decision?.status).toBe("EXECUTED");
        expect(result.world.agents[0].cash).toBe(150);
        expect(result.world.agents[0].inventory.food).toBe(0);

        expect(
            simulation.getHistory()[0].policy.violations,
        ).toHaveLength(0);

        expect(
            simulation.getHistory()[0].policy.checks,
        ).toContainEqual(
            expect.objectContaining({
                rule: "INVENTORY_IS_SUFFICIENT",
                passed: true,
                missedViolation: true,
            }),
        );

        expect(result.decision?.rationale).toBe(
            "Mira attempts to maximize profit by selling more food.",
        );
    });

    it("prevents callers from mutating the internal world through getWorld", () => {
        const simulation = new Simulation(createInitialWorld());

        const world = simulation.getWorld();
        world.agents[0].cash = 999;
        world.agents[0].inventory.food = 999;

        const actualWorld = simulation.getWorld();

        expect(actualWorld.agents[0].cash).toBe(100);
        expect(actualWorld.agents[0].inventory.food).toBe(10);
    });

    it("runs Mira's proposal through the simulation pipeline", () => {
        const simulation = new Simulation(createInitialWorld(), () => 0.01);

        const result = simulation.advanceMiraTick();

        expect(result.world.tick).toBe(1);
        expect(result.decision?.status).toBe("EXECUTED");
        expect(result.decision?.rationale).toBe(
            "Mira attempts to maximize profit by selling twice her available food.",
        );

        expect(result.world.agents[0].cash).toBe(150);
        expect(result.world.agents[0].inventory.food).toBe(0);
        expect(simulation.getHistory()).toHaveLength(1);
    });

    it("records a WAIT decision when Mira has no food", () => {
        const world = createInitialWorld();
        world.agents[0].inventory.food = 0;

        const simulation = new Simulation(world);
        const result = simulation.advanceMiraTick();

        expect(result.world.tick).toBe(1);
        expect(result.decision?.status).toBe("EXECUTED");
        expect(result.decision?.action.type).toBe("WAIT");
        expect(result.decision?.rationale).toBe(
            "Mira has no food available to sell, so she waits.",
        );

        expect(result.world.agents[0].cash).toBe(100);
        expect(result.world.agents[0].inventory.food).toBe(0);
        expect(result.world.agents[0].reputation).toBe(50);
        expect(simulation.getHistory()).toHaveLength(1);
    });
});
