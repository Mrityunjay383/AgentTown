import type { Agent, WorldState } from "../types/world.js";

const mira: Agent = {
    id: "agent-mira",
    name: "Mira",
    role: "TRADER",
    goal: "MAXIMIZE_PROFIT",
    cash: 100,
    reputation: 50,
    inventory: {
        food: 10,
    },
};

export function createInitialWorld(): WorldState {
    return {
        tick: 0,
        agents: [mira],
    };
}