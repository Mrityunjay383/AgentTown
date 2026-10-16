import {beforeEach, describe, expect, it, vi} from "vitest";
import {evaluateAction} from "./policyEvaluator.js";
import {processAction} from "./actionProcessor.js";
import type {Agent, WorldState} from "../types/world.js";

vi.mock("./policyEvaluator.js", () => ({
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
        inventory: {food: 10},
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
});
