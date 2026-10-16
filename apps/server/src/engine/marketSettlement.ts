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
    if (
        !Number.isInteger(action.quantity) ||
        action.quantity <= 0 ||
        !Number.isFinite(action.pricePerUnit) ||
        action.pricePerUnit <= 0
    ) {
        return {
            executed: false,
            message: "Settlement failed: invalid sale quantity or price.",
            cashEarned: 0,
            foodDeducted: 0,
        };
    }

    const cashEarned = action.quantity * action.pricePerUnit;

    // Intentional market bug: payment uses the claimed quantity,
    // while inventory deduction is capped at available food.
    const foodDeducted = Math.min(
        action.quantity,
        agent.inventory.food,
    );

    agent.inventory.food -= foodDeducted;
    agent.cash += cashEarned;

    return {
        executed: true,
        message: `Market settled sale of ${action.quantity} food. ${agent.name} received ${cashEarned} cash, but only ${foodDeducted} food was deducted.`,
        cashEarned,
        foodDeducted,
    };
}