import {render, screen} from "@testing-library/react";
import {describe, expect, it} from "vitest";
import {AgentCard} from "../../../../features/world/components/AgentCard.tsx";
import type {Agent} from "../../../../types/world.ts";

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

describe("AgentCard", () => {
    it("renders the agent's details and stats", () => {
        render(<AgentCard agent={mira}/>);

        expect(screen.getByText("Mira")).toBeInTheDocument();
        expect(screen.getByText("TRADER")).toBeInTheDocument();
        expect(screen.getByText("MAXIMIZE PROFIT")).toBeInTheDocument();
        expect(screen.getByText("100")).toBeInTheDocument();
        expect(screen.getByText("50")).toBeInTheDocument();
        expect(screen.getByText("10")).toBeInTheDocument();
    });
});
