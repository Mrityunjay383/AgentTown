
import type { WorldState } from "../types/world.js";
import type { AgentAction } from "../types/action.js";
import type { PolicyResult } from "../types/policy.js";
import { evaluateAction } from "./policyEvaluator.js";
import { settleFoodSale } from "./marketSettlement.js";

export interface ActionOutcome {
    action: AgentAction;
    policy: PolicyResult;
    executed: boolean;
    message: string;
}

export function processAction(
    world: WorldState,
    action: AgentAction,
): ActionOutcome {
    const policy = evaluateAction(world, action);

    const agent = world.agents.find(
        (candidate) => candidate.id === action.agentId,
    );

    if (!policy.accepted) {
        if (agent) {
            const totalPenalty = policy.violations.reduce(
                (total, violation) => total + violation.reputationPenalty,
                0,
            );

            agent.reputation = Math.max(
                0,
                agent.reputation - totalPenalty,
            );
        }

        return {
            action,
            policy,
            executed: false,
            message: "Action rejected by the policy engine.",
        };
    }

    if (!agent) {
        return {
            action,
            policy: {
                accepted: false,
                violations: [],
            },
            executed: false,
            message: "Execution denied: agent does not exist.",
        };
    }

    if (action.type === "SELL_FOOD") {
        const settlement = settleFoodSale(agent, action);

        return {
            action,
            policy,
            executed: settlement.executed,
            message: settlement.message,
        };
    }

    return {
        action,
        policy,
        executed: false,
        message: "Unsupported action.",
    };
}
