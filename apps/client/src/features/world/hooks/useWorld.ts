import { useCallback, useEffect, useState } from "react";
import { getWorld } from "../../../api/world.api";
import type { WorldState } from "../../../types/world";

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

    useEffect(() => {
        void refreshWorld();
    }, [refreshWorld]);

    return { world, error, isLoading, refreshWorld };
}
