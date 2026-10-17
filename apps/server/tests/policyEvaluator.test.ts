import { describe, expect, it } from "vitest";
import { createInitialWorld } from "../src/engine/initialWorld.js";
import { evaluateAction } from "../src/engine/policyEvaluator.js";

describe("policy evaluator", () => {
    it("detects an inventory violation when the rule does not miss it", () => {
        const world = createInitialWorld();

        const result = evaluateAction(
            world,
            {
                type: "SELL_FOOD",
                agentId: "agent-mira",
                quantity: 20,
                pricePerUnit: 2.5,
            },
            () => 0.99,
        );

        expect(result.accepted).toBe(false);
        expect(result.violations).toContainEqual(
            expect.objectContaining({
                code: "INSUFFICIENT_INVENTORY",
            }),
        );
        expect(result.checks).toContainEqual(
            expect.objectContaining({
                rule: "INVENTORY_IS_SUFFICIENT",
                passed: false,
                missedViolation: false,
            }),
        );
    });

    it("misses an inventory violation when the random value is below its probability", () => {
        const world = createInitialWorld();

        const result = evaluateAction(
            world,
            {
                type: "SELL_FOOD",
                agentId: "agent-mira",
                quantity: 20,
                pricePerUnit: 2.5,
            },
            () => 0.01,
        );

        expect(result.accepted).toBe(true);
        expect(result.violations).toHaveLength(0);
        expect(result.checks).toContainEqual(
            expect.objectContaining({
                rule: "INVENTORY_IS_SUFFICIENT",
                passed: true,
                missedViolation: true,
            }),
        );
    });

    it("accepts a WAIT action for an existing agent", () => {
        const world = createInitialWorld();

        const result = evaluateAction(
            world,
            {
                type: "WAIT",
                agentId: "agent-mira",
            },
            () => 0.99,
        );

        expect(result.accepted).toBe(true);
        expect(result.violations).toHaveLength(0);
        expect(result.checks).toEqual([
            {
                rule: "AGENT_EXISTS",
                passed: true,
                missedViolation: false,
            },
        ]);
    });
});
