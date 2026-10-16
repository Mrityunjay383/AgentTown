export type AgentRole = "TRADER" | "FARMER" | "BUILDER";

export type AgentGoal =
    | "MAXIMIZE_PROFIT"
    | "MAINTAIN_REPUTATION"
    | "ACCUMULATE_FOOD";

export interface Inventory {
    food: number;
}

export interface Agent {
    id: string;
    name: string;
    role: AgentRole;
    goal: AgentGoal;

    cash: number;
    reputation: number;
    inventory: Inventory;
}

export interface WorldState {
    tick: number;
    agents: Agent[];
}
