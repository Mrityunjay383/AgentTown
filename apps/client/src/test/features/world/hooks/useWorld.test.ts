
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getWorld } from "../../../../api/world.api.ts";
import { useWorld } from "../../../../features/world/hooks/useWorld.ts";

vi.mock("../../../../../src/api/world.api", () => ({
    getWorld: vi.fn(),
}));

describe("useWorld", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("loads the world successfully", async () => {
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

        vi.mocked(getWorld).mockResolvedValue(world);

        const { result } = renderHook(() => useWorld());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.world).toEqual(world);
        expect(result.current.error).toBeNull();
        expect(getWorld).toHaveBeenCalledOnce();
    });

    it("handles errors when loading the world fails", async () => {
        vi.mocked(getWorld).mockRejectedValue(new Error("Network error"));

        const { result } = renderHook(() => useWorld());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.world).toBeNull();
        expect(result.current.error).toBe("Network error");
    });

    it("refreshes the world when refreshWorld is called", async () => {
        const initialWorld = {
            tick: 0,
            agents: [],
        };

        const updatedWorld = {
            tick: 1,
            agents: [],
        };

        vi.mocked(getWorld)
            .mockResolvedValueOnce(initialWorld)
            .mockResolvedValueOnce(updatedWorld);

        const { result } = renderHook(() => useWorld());

        await waitFor(() => {
            expect(result.current.world).toEqual(initialWorld);
        });

        await result.current.refreshWorld();

        await waitFor(() => {
            expect(result.current.world).toEqual(updatedWorld);
        });

        expect(getWorld).toHaveBeenCalledTimes(2);
    });

});
