import type { WorldState } from "../types/world.js";
import type {
    AgentAction,
    SellFoodAction,
} from "../types/action.js";
import type {
    PolicyResult,
    PolicyRule,
    PolicyViolation,
} from "../types/policy.js";
import { policyConfig } from "./policyConfig.js";

function ruleMissesViolation(rule: PolicyRule): boolean {
    return Math.random() < policyConfig[rule].failureProbability;
}

export function evaluateAction(
    world: WorldState,
    action: AgentAction,
): PolicyResult {
    const violations: PolicyViolation[] = [];

    const agent = world.agents.find(
        (candidate) => candidate.id === action.agentId,
    );

    if (!agent) {
        if (!ruleMissesViolation("AGENT_EXISTS")) {
            violations.push({
                code: "AGENT_NOT_FOUND",
                message: `Agent ${action.agentId} does not exist.`,
                reputationPenalty: 10,
            });
        }
    }

    if (action.type === "SELL_FOOD") {
        const sellAction = action as SellFoodAction;

        if (
            !Number.isInteger(sellAction.quantity) ||
            sellAction.quantity <= 0
        ) {
            if (!ruleMissesViolation("QUANTITY_IS_VALID")) {
                violations.push({
                    code: "INVALID_QUANTITY",
                    message: "Quantity must be a positive integer.",
                    reputationPenalty: 5,
                });
            }
        }

        if (
            !Number.isFinite(sellAction.pricePerUnit) ||
            sellAction.pricePerUnit <= 0
        ) {
            if (!ruleMissesViolation("PRICE_IS_VALID")) {
                violations.push({
                    code: "INVALID_PRICE",
                    message: "Price must be a positive finite number.",
                    reputationPenalty: 5,
                });
            }
        }

        if (
            agent &&
            Number.isInteger(sellAction.quantity) &&
            sellAction.quantity > agent.inventory.food
        ) {
            if (!ruleMissesViolation("INVENTORY_IS_SUFFICIENT")) {
                violations.push({
                    code: "INSUFFICIENT_INVENTORY",
                    message: `${agent.name} has ${agent.inventory.food} food but attempted to sell ${sellAction.quantity}.`,
                    reputationPenalty: 10,
                });
            }
        }
    }

    return {
        accepted: violations.length === 0,
        violations,
    };
}
