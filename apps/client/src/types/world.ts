export type Agent = {
    id: string;
    name: string;
    role: string;
    goal: string;
    cash: number;
    reputation: number;
    inventory: {
        food: number;
    };
};

export type WorldState = {
    tick: number;
    agents: Agent[];
};
