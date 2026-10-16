export type PolicyRule =
    | "AGENT_EXISTS"
    | "QUANTITY_IS_VALID"
    | "PRICE_IS_VALID"
    | "INVENTORY_IS_SUFFICIENT";

export type PolicyViolationCode =
    | "AGENT_NOT_FOUND"
    | "INVALID_QUANTITY"
    | "INVALID_PRICE"
    | "INSUFFICIENT_INVENTORY";

export interface PolicyViolation {
    code: PolicyViolationCode;
    message: string;
    reputationPenalty: number;
}

export interface PolicyResult {
    accepted: boolean;
    violations: PolicyViolation[];
    checks: PolicyCheck[];
}

export interface PolicyCheck {
    rule: PolicyRule;
    passed: boolean;
    missedViolation: boolean;
}