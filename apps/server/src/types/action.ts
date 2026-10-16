export interface SellFoodAction {
    type: "SELL_FOOD";
    agentId: string;
    quantity: number;
    pricePerUnit: number;
}

export type AgentAction = SellFoodAction;

export interface ActionProposal {
    action: AgentAction;
    rationale: string;
}