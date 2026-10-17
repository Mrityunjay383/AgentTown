import { describe, expect, it } from "vitest";
import { createInitialWorld } from "../src/engine/initialWorld.js";
import { createMiraProposal } from "../src/agents/mira.js";

describe("Mira agent", () => {
    it("proposes selling twice her available food to maximize profit", () => {
        const world = createInitialWorld();
        const mira = world.agents[0];

        const proposal = createMiraProposal(mira);

        expect(proposal.action).toEqual({
            type: "SELL_FOOD",
            agentId: "agent-mira",
            quantity: 20,
            pricePerUnit: 2.5,
        });

        expect(proposal.rationale).toBe(
            "Mira attempts to maximize profit by selling twice her available food.",
        );

        // Proposing an action must not mutate the agent.
        expect(mira.cash).toBe(100);
        expect(mira.inventory.food).toBe(10);
    });

    it("proposes a conservative sale when prioritizing reputation", () => {
        const world = createInitialWorld();
        const mira = world.agents[0];

        mira.goal = "MAINTAIN_REPUTATION";

        const proposal = createMiraProposal(mira);

        expect(proposal.action).toEqual({
            type: "SELL_FOOD",
            agentId: "agent-mira",
            quantity: 1,
            pricePerUnit: 2.5,
        });

        expect(proposal.rationale).toBe(
            "Mira prioritizes reputation by making a conservative sale.",
        );

        expect(mira.cash).toBe(100);
        expect(mira.inventory.food).toBe(10);
    });

    it("proposes a small sale to fund future food purchases", () => {
        const world = createInitialWorld();
        const mira = world.agents[0];

        mira.goal = "ACCUMULATE_FOOD";

        const proposal = createMiraProposal(mira);

        expect(proposal.action).toEqual({
            type: "SELL_FOOD",
            agentId: "agent-mira",
            quantity: 1,
            pricePerUnit: 2.5,
        });

        expect(proposal.rationale).toBe(
            "Mira temporarily sells a small amount of food to fund future food purchases.",
        );

        expect(mira.cash).toBe(100);
        expect(mira.inventory.food).toBe(10);
    });

    it("avoids attempting a sale when Mira has no food", () => {
        const world = createInitialWorld();
        const mira = world.agents[0];

        mira.inventory.food = 0;

        const proposal = createMiraProposal(mira);

        expect(proposal.action).toEqual({
            type: "WAIT",
            agentId: "agent-mira",
        })

        expect(proposal.rationale).toBe(
            "Mira has no food available to sell, so she waits.",
        );

        expect(mira.cash).toBe(100);
        expect(mira.inventory.food).toBe(0);
    });
});
