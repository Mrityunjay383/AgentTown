import type { WorldState } from "../types/world.js";
import type { AgentAction } from "../types/action.js";
import type { PolicyResult } from "../types/policy.js";
import type { DecisionRecord, DecisionStatus } from "../types/decision.js";
import { evaluateAction } from "./policyEvaluator.js";
import { settleFoodSale } from "./marketSettlement.js";

export interface ActionOutcome {
    record: DecisionRecord;
}

function createRecord(
    world: WorldState,
    action: AgentAction,
    policy: PolicyResult,
    status: DecisionStatus,
    message: string,
    agentName: string,
    goal: string,
    before: {
        cash: number;
        food: number;
        reputation: number;
    },
    agent?: WorldState["agents"][number],
): DecisionRecord {
    return {
        id: `${world.tick}-${action.agentId}-${Date.now()}`,
        tick: world.tick,
        agentId: action.agentId,
        agentName,
        goal,
        rationale: "No agent rationale supplied yet.",
        action,
        policy,
        reputationPenalty: before.reputation - (agent?.reputation ?? before.reputation),
        status,
        outcomeMessage: message,
        cashBefore: before.cash,
        cashAfter: agent?.cash ?? before.cash,
        foodBefore: before.food,
        foodAfter: agent?.inventory.food ?? before.food,
        reputationBefore: before.reputation,
        reputationAfter: agent?.reputation ?? before.reputation,
    };
}

export function processAction(
    world: WorldState,
    action: AgentAction,
): ActionOutcome {
    const agent = world.agents.find(
        (candidate) => candidate.id === action.agentId,
    );

    const before = {
        cash: agent?.cash ?? 0,
        food: agent?.inventory.food ?? 0,
        reputation: agent?.reputation ?? 0,
    };

    const policy = evaluateAction(world, action);

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
            record: createRecord(
                world,
                action,
                policy,
                "REJECTED",
                "Action rejected by the policy engine.",
                agent?.name ?? "Unknown agent",
                agent?.goal ?? "UNKNOWN",
                before,
                agent,
            ),
        };
    }

    if (!agent) {
        return {
            record: createRecord(
                world,
                action,
                {
                    accepted: false,
                    violations: [],
                },
                "REJECTED",
                "Execution denied: agent does not exist.",
                "Unknown agent",
                "UNKNOWN",
                before,
            ),
        };
    }

    if (action.type === "SELL_FOOD") {
        const settlement = settleFoodSale(agent, action);

        return {
            record: createRecord(
                world,
                action,
                policy,
                settlement.executed ? "EXECUTED" : "SETTLEMENT_FAILED",
                settlement.message,
                agent.name,
                agent.goal,
                before,
                agent,
            ),
        };
    }

    return {
        record: createRecord(
            world,
            action,
            policy,
            "SETTLEMENT_FAILED",
            "Unsupported action.",
            agent.name,
            agent.goal,
            before,
            agent,
        ),
    };
}
