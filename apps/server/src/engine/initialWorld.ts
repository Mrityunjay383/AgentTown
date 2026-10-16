import type { Agent, WorldState } from "../types/world.js";

export function createInitialWorld(): WorldState {
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