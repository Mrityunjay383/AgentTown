import { describe, expect, it } from "vitest";
import { settleFoodSale } from "./marketSettlement.js";
import type { Agent } from "../types/world.js";

describe("market settlement", () => {
    it("pays for the claimed quantity but deducts only available food", () => {
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

        const result = settleFoodSale(mira, {
            type: "SELL_FOOD",
            agentId: "agent-mira",
            quantity: 20,
            pricePerUnit: 2.5,
        });

        expect(result.executed).toBe(true);
        expect(result.cashEarned).toBe(50);
        expect(result.foodDeducted).toBe(10);
        expect(mira.cash).toBe(150);
        expect(mira.inventory.food).toBe(0);
    });
});
