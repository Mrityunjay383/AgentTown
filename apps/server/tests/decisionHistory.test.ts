import { describe, expect, it } from "vitest";
import { DecisionHistory } from "../src/engine/decisionHistory.js";
import { createInitialWorld } from "../src/engine/initialWorld.js";
import { Simulation } from "../src/engine/simulation.js";

describe("decision history", () => {
    it("stores decisions and filters them by agent", () => {
        const simulation = new Simulation(createInitialWorld());

        simulation.advanceTick({
            type: "SELL_FOOD",
            agentId: "agent-mira",
            quantity: 2,
            pricePerUnit: 2,
        });

        expect(simulation.getHistory()).toHaveLength(1);
        expect(simulation.getAgentHistory("agent-mira")).toHaveLength(1);
        expect(simulation.getAgentHistory("unknown-agent")).toHaveLength(0);
    });

    it("clears all stored decisions", () => {
        const history = new DecisionHistory();

        history.clear();

        expect(history.getAll()).toHaveLength(0);
    });
});
