export interface SellFoodAction {
    type: "SELL_FOOD";
    agentId: string;
    quantity: number;
    pricePerUnit: number;
}

export interface WaitAction {
    type: "WAIT";
    agentId: string;
}

export type AgentAction = SellFoodAction | WaitAction;

export interface ActionProposal {
    action: AgentAction;
    rationale: string;
}

