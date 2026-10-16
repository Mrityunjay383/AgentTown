import type { WorldState } from "../types/world.js";
import type { AgentAction, SellFoodAction } from "../types/action.js";
import type {
    PolicyResult,
    PolicyRule,
    PolicyViolation,
    PolicyCheck,
} from "../types/policy.js";
import { policyConfig } from "./policyConfig.js";

function checkRule(
    rule: PolicyRule,
    hasViolation: boolean,
    random: () => number,
): PolicyCheck {
    const missedViolation =
        hasViolation && random() < policyConfig[rule].failureProbability;

    return {
        rule,
        passed: !hasViolation || missedViolation,
        missedViolation,
    };
}

export function evaluateAction(
    world: WorldState,
    action: AgentAction,
    random: () => number = Math.random,
): PolicyResult {
    const violations: PolicyViolation[] = [];
    const checks: PolicyCheck[] = [];

    const agent = world.agents.find(
        (candidate) => candidate.id === action.agentId,
    );

    const agentExistsCheck = checkRule(
        "AGENT_EXISTS",
        !agent,
        random,
    );
    checks.push(agentExistsCheck);

    if (!agentExistsCheck.passed) {
        violations.push({
            code: "AGENT_NOT_FOUND",
            message: `Agent ${action.agentId} does not exist.`,
            reputationPenalty: 10,
        });
    }

    if (action.type === "SELL_FOOD") {
        const sellAction = action as SellFoodAction;

        const invalidQuantity =
            !Number.isInteger(sellAction.quantity) ||
            sellAction.quantity <= 0;

        const quantityCheck = checkRule(
            "QUANTITY_IS_VALID",
            invalidQuantity,
            random,
        );
        checks.push(quantityCheck);

        if (!quantityCheck.passed) {
            violations.push({
                code: "INVALID_QUANTITY",
                message: "Quantity must be a positive integer.",
                reputationPenalty: 5,
            });
        }

        const invalidPrice =
            !Number.isFinite(sellAction.pricePerUnit) ||
            sellAction.pricePerUnit <= 0;

        const priceCheck = checkRule(
            "PRICE_IS_VALID",
            invalidPrice,
            random,
        );
        checks.push(priceCheck);

        if (!priceCheck.passed) {
            violations.push({
                code: "INVALID_PRICE",
                message: "Price must be a positive finite number.",
                reputationPenalty: 5,
            });
        }

        const insufficientInventory =
            Boolean(agent) &&
            Number.isInteger(sellAction.quantity) &&
            sellAction.quantity > agent!.inventory.food;

        const inventoryCheck = checkRule(
            "INVENTORY_IS_SUFFICIENT",
            insufficientInventory,
            random,
        );
        checks.push(inventoryCheck);

        if (!inventoryCheck.passed && agent) {
            violations.push({
                code: "INSUFFICIENT_INVENTORY",
                message: `${agent.name} has ${agent.inventory.food} food but attempted to sell ${sellAction.quantity}.`,
                reputationPenalty: 10,
            });
        }
    }

    return {
        accepted: violations.length === 0,
        violations,
        checks,
    };
}
