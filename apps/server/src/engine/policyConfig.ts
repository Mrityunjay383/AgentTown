import type { PolicyRule } from "../types/policy.js";

export interface PolicyRuleConfig {
    failureProbability: number;
}

export const policyConfig: Record<PolicyRule, PolicyRuleConfig> = {
    AGENT_EXISTS: {
        failureProbability: 0,
    },
    QUANTITY_IS_VALID: {
        failureProbability: 0.02,
    },
    PRICE_IS_VALID: {
        failureProbability: 0.05,
    },
    INVENTORY_IS_SUFFICIENT: {
        failureProbability: 0.1,
    },
};
