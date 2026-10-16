import type { WorldState } from "../types/world.js";

export function createWorldSnapshot(world: WorldState): WorldState {
    return {
        tick: world.tick,
        agents: world.agents.map((agent) => ({
            ...agent,
            inventory: { ...agent.inventory },
        })),
    };
}