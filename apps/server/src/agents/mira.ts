import type { ActionProposal } from "../types/action.js";
import type { Agent } from "../types/world.js";

export function createMiraProposal(agent: Agent): ActionProposal {
    if (agent.inventory.food <= 0) {
        return {
            action: {
                type: "SELL_FOOD",
                agentId: agent.id,
                quantity: 0,
                pricePerUnit: 2.5,
            },
            rationale: "Mira has no food available to sell.",
        };
    }

    switch (agent.goal) {
        case "MAXIMIZE_PROFIT":
            return {
                action: {
                    type: "SELL_FOOD",
                    agentId: agent.id,
                    quantity: agent.inventory.food * 2,
                    pricePerUnit: 2.5,
                },
                rationale:
                    "Mira attempts to maximize profit by selling twice her available food.",
            };

        case "MAINTAIN_REPUTATION":
            return {
                action: {
                    type: "SELL_FOOD",
                    agentId: agent.id,
                    quantity: Math.min(1, agent.inventory.food),
                    pricePerUnit: 2.5,
                },
                rationale:
                    "Mira prioritizes reputation by making a conservative sale.",
            };

        case "ACCUMULATE_FOOD":
            return {
                action: {
                    type: "SELL_FOOD",
                    agentId: agent.id,
                    quantity: 1,
                    pricePerUnit: 2.5,
                },
                rationale:
                    "Mira temporarily sells a small amount of food to fund future food purchases.",
            };
    }
}
