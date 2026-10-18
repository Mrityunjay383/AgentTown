import { useCallback, useEffect, useState } from "react";
import {getWorld, tickWorld} from "../../../api/world.api";
import type { WorldState } from "../../../types/world";
import type {DecisionRecord} from "../../../types/decision.ts";

export function useWorld() {
    const [world, setWorld] = useState<WorldState | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshWorld = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await getWorld();
            setWorld(data);
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to load world",
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    const advanceTick = useCallback(async (): Promise<DecisionRecord | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await tickWorld();
            setWorld(result.world);
            return result.decision;
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to advance simulation",
            );
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void refreshWorld();
    }, [refreshWorld]);

    return { world, error, isLoading, refreshWorld, advanceTick };
}
