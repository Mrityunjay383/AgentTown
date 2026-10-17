import { beforeEach, describe, expect, it, vi } from "vitest";
import { evaluateAction } from "../src/engine/policyEvaluator.js";
import { processAction } from "../src/engine/actionProcessor.js";
import type { Agent, WorldState } from "../src/types/world.js";
import {createInitialWorld} from "../src/engine/initialWorld";

vi.mock("../src/engine/policyEvaluator.js", () => ({
    evaluateAction: vi.fn(),
}));

const mockedEvaluateAction = vi.mocked(evaluateAction);

function createWorld(): WorldState {
    const mira: Agent = {
        id: "agent-mira",
        name: "Mira",
        role: "TRADER",
        goal: "MAXIMIZE_PROFIT",
        cash: 100,
        reputation: 50,
        inventory: { food: 10 },
    };

    return {
        tick: 0,
        agents: [mira],
    };
}

describe("action processor", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("rejects a detected inventory violation and penalizes reputation", () => {
        const world = createWorld();

        mockedEvaluateAction.mockReturnValue({
            accepted: false,
            violations: [
                {
                    code: "INSUFFICIENT_INVENTORY",
                    message: "Mira has only 10 food but attempted to sell 20.",
                    reputationPenalty: 10,
                },
            ],
            checks: [
                {
                    rule: "AGENT_EXISTS",
                    passed: true,
                    missedViolation: false,
                },
                {
                    rule: "INVENTORY_IS_SUFFICIENT",
                    passed: false,
                    missedViolation: false,
                },
            ],
        });

        const result = processAction(world, {
            type: "SELL_FOOD",
            agentId: "agent-mira",
            quantity: 20,
            pricePerUnit: 2.5,
        });

        const mira = world.agents[0];

        expect(result.record.status).toBe("REJECTED");
        expect(mira.reputation).toBe(40);
        expect(mira.inventory.food).toBe(10);
        expect(mira.cash).toBe(100);
    });


    it("executes WAIT without changing agent state", () => {
        const world = createInitialWorld();

        mockedEvaluateAction.mockReturnValue({
            accepted: true,
            violations: [],
            checks: [
                {
                    rule: "AGENT_EXISTS",
                    passed: true,
                    missedViolation: false,
                },
            ],
        });

        const outcome = processAction(
            world,
            {
                type: "WAIT",
                agentId: "agent-mira",
            },
            () => 0.99,
            "Mira waits because she has no food.",
        );

        expect(outcome.record.status).toBe("EXECUTED");
        expect(outcome.record.rationale).toBe(
            "Mira waits because she has no food.",
        );
        expect(outcome.record.cashBefore).toBe(100);
        expect(outcome.record.cashAfter).toBe(100);
        expect(outcome.record.foodBefore).toBe(10);
        expect(outcome.record.foodAfter).toBe(10);
        expect(outcome.record.reputationBefore).toBe(50);
        expect(outcome.record.reputationAfter).toBe(50);
    });

});
