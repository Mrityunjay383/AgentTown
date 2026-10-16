import type { Agent } from "../types/world.js";
import type { SellFoodAction } from "../types/action.js";

export interface SettlementResult {
    executed: boolean;
    message: string;
    cashEarned: number;
    foodDeducted: number;
}

export function settleFoodSale(
    agent: Agent,
    action: SellFoodAction,
): SettlementResult {
    const cashEarned = action.quantity * action.pricePerUnit;

    // Intentional market bug:
    // Payment is based on the claimed quantity, while inventory
    // deduction is capped at the quantity the agent actually owns.
    const foodDeducted = Math.min(
        action.quantity,
        agent.inventory.food,
    );

    agent.inventory.food -= foodDeducted;
    agent.cash += cashEarned;

    return {
        executed: true,
        message: `Market settled sale of ${action.quantity} food. Mira received ${cashEarned} cash, but only ${foodDeducted} food was deducted.`,
        cashEarned,
        foodDeducted,
    };
}
