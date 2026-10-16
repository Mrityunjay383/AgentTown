import type { ActionProposal } from "../types/action.js";
import type { Agent } from "../types/world.js";

export function createMiraProposal(agent: Agent): ActionProposal {
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
}