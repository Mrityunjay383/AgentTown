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
});
