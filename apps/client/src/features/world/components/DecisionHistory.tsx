import type {DecisionRecord} from "../../../types/decision";

type DecisionHistoryProps = {
    history: DecisionRecord[];
    isLoading: boolean;
    error: string | null;
};

export function DecisionHistory({history, isLoading, error,}: DecisionHistoryProps) {
    return (
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                    Decision History
                </h2>
                <span className="text-sm text-slate-400">
                    {history.length} decisions
                </span>
            </div>

            {isLoading && (
                <p className="text-sm text-slate-400">
                    Loading decision history...
                </p>
            )}

            {error && (
                <p className="text-sm text-red-400">{error}</p>
            )}

            {!isLoading && !error && history.length === 0 && (
                <p className="text-sm text-slate-400">
                    No decisions yet. Advance a tick to see an agent's
                    actions here.
                </p>
            )}

            {!isLoading && history.length > 0 && (
                <div className="space-y-3 h-[70vh] overflow-y-auto pr-2 [scrollbar-gutter:stable]">
                    {[...history].reverse().map((decision) => (
                        <article
                            key={decision.id}
                            className="rounded-lg border border-slate-800 bg-slate-950 p-4"
                        >
                            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                <div className="font-medium text-white">
                                    {decision.agentName}
                                    <span className="ml-2 text-sm text-slate-400">
                                        Tick {decision.tick}
                                    </span>
                                </div>

                                <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-200">
                                    {decision.status.replaceAll("_", " ")}
                                </span>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Rationale
                                    </p>
                                    <p className="mt-1 text-sm text-slate-300">
                                        {decision.rationale || "No rationale provided."}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Outcome
                                    </p>
                                    <p className="mt-1 text-sm text-slate-300">
                                        {decision.outcomeMessage}
                                    </p>
                                </div>
                            </div>

                            <p className="mt-2 text-xs text-slate-500">
                                Reputation: {decision.reputationBefore}
                                {" → "}
                                {decision.reputationAfter}
                                {" · "}
                                Cash: {decision.cashBefore}
                                {" → "}
                                {decision.cashAfter}
                            </p>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}
