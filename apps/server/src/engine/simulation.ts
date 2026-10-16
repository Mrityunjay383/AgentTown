import type { AgentAction } from "../types/action.js";
import type { DecisionRecord } from "../types/decision.js";
import type { WorldState } from "../types/world.js";
import { processAction } from "./actionProcessor.js";
import { DecisionHistory } from "./decisionHistory.js";

export interface TickResult {
    world: WorldState;
    decision: DecisionRecord | null;
}

export class Simulation {
    private readonly history = new DecisionHistory();

    constructor(
        private readonly world: WorldState,
        private readonly random: () => number = Math.random,
    ) {}

    advanceTick(action?: AgentAction): TickResult {
        this.world.tick += 1;

        if (!action) {
            return {
                world: this.world,
                decision: null,
            };
        }

        const outcome = processAction(this.world, action, this.random);
        this.history.add(outcome.record);

        return {
            world: this.world,
            decision: outcome.record,
        };
    }

    getHistory(): DecisionRecord[] {
        return this.history.getAll();
    }

    getAgentHistory(agentId: string): DecisionRecord[] {
        return this.history.getByAgent(agentId);
    }

    getWorld(): WorldState {
        return this.world;
    }
}
