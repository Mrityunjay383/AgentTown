import { useCallback, useEffect, useState } from "react";
import { getWorldHistory } from "../../../api/world.api";
import type { DecisionRecord } from "../../../types/decision";

export function useWorldHistory() {
    const [history, setHistory] = useState<DecisionRecord[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshHistory = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await getWorldHistory();
            setHistory(data);
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to load decision history",
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    const appendDecision = useCallback((decision: DecisionRecord) => {
        setHistory((currentHistory) => [
            ...currentHistory,
            decision,
        ]);
    }, []);

    useEffect(() => {
        void refreshHistory();
    }, [refreshHistory]);

    return {
        history,
        error,
        isLoading,
        refreshHistory,
        appendDecision,
    };
}
