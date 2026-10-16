import type { AgentAction } from "./action.js";
import type { PolicyResult } from "./policy.js";

export type DecisionStatus =
    | "REJECTED"
    | "EXECUTED"
    | "SETTLEMENT_FAILED";

export interface DecisionRecord {
    id: string;
    tick: number;
    agentId: string;
    agentName: string;

    goal: string;
    rationale: string;
    action: AgentAction;

    policy: PolicyResult;
    reputationPenalty: number;

    status: DecisionStatus;
    outcomeMessage: string;

    cashBefore: number;
    cashAfter: number;
    foodBefore: number;
    foodAfter: number;
    reputationBefore: number;
    reputationAfter: number;
}
