import type {DecisionRecord} from "../../../types/decision";
import {useState} from "react";
import {DecisionDetailsModal} from "./DecisionDetailsModal.tsx";

type DecisionHistoryProps = {
    history: DecisionRecord[];
    isLoading: boolean;
    error: string | null;
};

export function DecisionHistory({history, isLoading, error,}: DecisionHistoryProps) {
    const [selectedDecision, setSelectedDecision] =
        useState<DecisionRecord | null>(null);

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
                            onClick={() => setSelectedDecision(decision)}
                            className={`group relative cursor-pointer overflow-hidden rounded-xl border bg-slate-950/70 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-900/90 hover:shadow-lg ${
                                decision.status === "EXECUTED"
                                    ? "border-slate-800 hover:border-emerald-800/80"
                                    : decision.status === "REJECTED"
                                        ? "border-slate-800 hover:border-amber-800/80"
                                        : "border-slate-800 hover:border-red-800/80"
                            }`}
                        >
                            <div
                                className={`absolute inset-y-3 left-0 w-1 rounded-r-full ${
                                    decision.status === "EXECUTED"
                                        ? "bg-emerald-500"
                                        : decision.status === "REJECTED"
                                            ? "bg-amber-500"
                                            : "bg-red-500"
                                }`}
                            />
                            <div className="mb-4 flex items-center justify-between gap-3 pl-2">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div
                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-sm font-bold text-cyan-400">
                                        {decision.agentName.charAt(0).toUpperCase()}
                                    </div>

                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                            <h3 className="text-sm font-semibold text-slate-100">
                                                {decision.agentName}
                                            </h3>

                                            <span className="text-xs text-slate-500">
                                            Tick {decision.tick}
                                        </span>
                                        </div>

                                        <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                                            {decision.action.type.replaceAll("_", " ")}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex shrink-0 items-center gap-2">
                                    <span
                                        className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-wide ${
                                            decision.status === "EXECUTED"
                                                ? "border-emerald-800/70 bg-emerald-950/50 text-emerald-400"
                                                : decision.status === "REJECTED"
                                                    ? "border-amber-800/70 bg-amber-950/50 text-amber-400"
                                                    : "border-red-800/70 bg-red-950/50 text-red-400"
                                        }`}
                                    >
                                        {decision.status.replaceAll("_", " ")}
                                    </span>
                                </div>
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

                            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-800 pt-3 sm:grid-cols-3">
                                <ResourceChange
                                    label="Reputation"
                                    before={decision.reputationBefore}
                                    after={decision.reputationAfter}
                                />

                                <ResourceChange
                                    label="Cash"
                                    before={decision.cashBefore}
                                    after={decision.cashAfter}
                                />

                                <ResourceChange
                                    label="Food"
                                    before={decision.foodBefore}
                                    after={decision.foodAfter}
                                />
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {selectedDecision && (
                <DecisionDetailsModal
                    decision={selectedDecision}
                    onClose={() => setSelectedDecision(null)}
                />
            )}

        </section>
    );
}


type ResourceChangeProps = {
    label: string;
    before: number;
    after: number;
};

function ResourceChange({label, before, after}: ResourceChangeProps) {
    const difference = after - before;

    const changeColor =
        difference > 0
            ? "text-emerald-400"
            : difference < 0
                ? "text-red-400"
                : "text-slate-400";

    return (
        <div className="min-w-0">
            <p className="text-xs text-slate-500">{label}</p>

            <p className="mt-1 text-sm font-medium tabular-nums text-slate-300">
                {before}
                <span className="mx-1 text-slate-600">→</span>
                {after}
            </p>

            <p className={`mt-1 text-xs font-medium ${changeColor}`}>
                {difference > 0 ? "+" : ""}
                {difference}
            </p>
        </div>
    );
}
