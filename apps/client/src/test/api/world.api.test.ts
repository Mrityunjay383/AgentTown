import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "../../api";
import { getWorld } from "../../api/world.api";

vi.mock("../../api/index", () => ({
    apiClient: {
        get: vi.fn(),
    },
}));

describe("getWorld", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("fetches the world and returns response data", async () => {
        const world = {
            tick: 0,
            agents: [
                {
                    id: "agent-mira",
                    name: "Mira",
                    role: "TRADER",
                    goal: "MAXIMIZE_PROFIT",
                    cash: 100,
                    reputation: 50,
                    inventory: { food: 10 },
                },
            ],
        };

        vi.mocked(apiClient.get).mockResolvedValue({ data: world });

        const result = await getWorld();

        expect(apiClient.get).toHaveBeenCalledWith("/world");
        expect(result).toEqual(world);
    });
});