import { describe, expect, it } from "vitest";
import { DecisionHistory } from "../src/engine/decisionHistory.js";
import { createInitialWorld } from "../src/engine/initialWorld.js";
import { Simulation } from "../src/engine/simulation.js";

describe("decision history", () => {
    it("stores decisions and filters them by agent", () => {
        const simulation = new Simulation(createInitialWorld());

        simulation.advanceTick({
            action: {
                type: "SELL_FOOD",
                agentId: "agent-mira",
                quantity: 2,
                pricePerUnit: 2,
            },
            rationale: "Mira sells food to earn cash.",
        });

        expect(simulation.getHistory()).toHaveLength(1);
        expect(simulation.getAgentHistory("agent-mira")).toHaveLength(1);
        expect(simulation.getAgentHistory("unknown-agent")).toHaveLength(0);
        expect(simulation.getHistory()[0].rationale).toBe(
            "Mira sells food to earn cash.",
        );
    });

    it("keeps stored records unchanged when the original record is mutated", () => {
        const simulation = new Simulation(createInitialWorld());

        simulation.advanceTick({
            action: {
                type: "SELL_FOOD",
                agentId: "agent-mira",
                quantity: 2,
                pricePerUnit: 2,
            },
            rationale: "Mira sells food to earn cash.",
        });

        const history = simulation.getHistory();
        expect(history[0].rationale).toBe("Mira sells food to earn cash.");

        history[0].rationale = "Changed after the decision.";

        expect(simulation.getHistory()[0].rationale).toBe(
            "Mira sells food to earn cash.",
        );
    });

    it("clears all stored decisions", () => {
        const history = new DecisionHistory();

        history.clear();

        expect(history.getAll()).toHaveLength(0);
    });
});
