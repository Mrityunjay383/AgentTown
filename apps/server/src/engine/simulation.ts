import type { AgentAction } from "../types/action.js";
import type { DecisionRecord } from "../types/decision.js";
import type { WorldState } from "../types/world.js";
import { processAction } from "./actionProcessor.js";

export interface TickResult {
    world: WorldState;
    decision: DecisionRecord | null;
}

export function advanceTick(
    world: WorldState,
    action?: AgentAction,
): TickResult {
    world.tick += 1;

    if (!action) {
        return {
            world,
            decision: null,
        };
    }

    const outcome = processAction(world, action);

    return {
        world,
        decision: outcome.record,
    };
}