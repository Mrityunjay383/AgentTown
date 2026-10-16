import type { ActionProposal } from "../types/action.js";
import { createWorldSnapshot } from "./worldSnapshot.js";
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

    advanceTick(proposal?: ActionProposal): TickResult {
        this.world.tick += 1;

        if (!proposal) {
            return {
                world: this.world,
                decision: null,
            };
        }

        const outcome = processAction(
            this.world,
            proposal.action,
            this.random,
            proposal.rationale,
        );
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
        return createWorldSnapshot(this.world);
    }
}
