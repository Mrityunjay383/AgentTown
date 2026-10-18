import type { ReactNode } from "react";
import type { DecisionRecord } from "../../../types/decision";

type DecisionDetailsModalProps = {
    decision: DecisionRecord;
    onClose: () => void;
};

type PolicyEvaluation = {
    accepted?: boolean;
    violations?: {
        code: string;
        message: string;
        reputationPenalty: number;
    }[];
    checks?: {
        rule: string;
        passed: boolean;
        missedViolation: boolean;
    }[];
};

export function DecisionDetailsModal({
                                         decision,
                                         onClose,
                                     }: DecisionDetailsModalProps) {
    const action = decision.action;
    const policy = decision.policy as PolicyEvaluation;

    const actionDescription =
        action.type === "SELL_FOOD"
            ? `Sell ${String(action.quantity ?? "—")} food units at ${String(action.pricePerUnit ?? "—")} cash per unit`
            : action.type.replaceAll("_", " ");

    const statusStyles: Record<string, string> = {
        EXECUTED:
            "border-emerald-800 bg-emerald-950/50 text-emerald-400",
        REJECTED:
            "border-amber-800 bg-amber-950/50 text-amber-400",
        SETTLEMENT_FAILED:
            "border-red-800 bg-red-950/50 text-red-400",
    };

    const statusStyle =
        statusStyles[decision.status] ??
        "border-slate-700 bg-slate-800 text-slate-300";

    const statusMessage =
        decision.status === "EXECUTED"
            ? "The proposed action was executed."
            : decision.status === "REJECTED"
                ? "The policy engine rejected the proposed action."
                : decision.status === "SETTLEMENT_FAILED"
                    ? "The action could not be settled successfully."
                    : decision.outcomeMessage;

    function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
        if (event.key === "Escape") {
            onClose();
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={onClose}
            onKeyDown={handleKeyDown}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="decision-modal-title"
                className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl sm:p-7"
                onClick={(event) => event.stopPropagation()}
            >
                {/* Header */}
                <header className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-900/70 bg-cyan-950/50 text-lg font-bold text-cyan-400">
                            {decision.agentName.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0">
                            <p className="text-xs font-medium uppercase tracking-widest text-cyan-400">
                                Decision details · Tick {decision.tick}
                            </p>

                            <h2
                                id="decision-modal-title"
                                className="mt-1 text-2xl font-bold text-white"
                            >
                                {decision.agentName}
                            </h2>

                            <p className="mt-1 text-sm text-slate-400">
                                {decision.goal.replaceAll("_", " ")}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close decision details"
                        className="shrink-0 rounded-lg border border-slate-700 p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                    >
                        ✕
                    </button>
                </header>

                {/* Decision summary */}
                <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusStyle}`}
                        >
                            {decision.status.replaceAll("_", " ")}
                        </span>

                        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            {action.type.replaceAll("_", " ")}
                        </span>
                    </div>

                    <p className="mt-4 text-base font-semibold leading-6 text-white">
                        {actionDescription}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-300">
                        {decision.outcomeMessage}
                    </p>

                    <p className="mt-3 border-t border-slate-800 pt-3 text-xs text-slate-500">
                        {statusMessage}
                    </p>
                </div>

                <div className="mt-6 space-y-5">
                    {/* Agent rationale */}
                    <DetailSection title="Agent rationale">
                        <p className="text-sm leading-6 text-slate-300">
                            {decision.rationale || "No rationale provided."}
                        </p>
                    </DetailSection>

                    {/* Policy evaluation */}
                    <DetailSection title="Policy evaluation">
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-sm text-slate-400">
                                Overall policy result
                            </p>

                            <span
                                className={`text-sm font-semibold ${
                                    policy.accepted
                                        ? "text-emerald-400"
                                        : "text-red-400"
                                }`}
                            >
                                {policy.accepted ? "Accepted" : "Rejected"}
                            </span>
                        </div>

                        {policy.checks && policy.checks.length > 0 ? (
                            <div className="mt-4 space-y-2">
                                {policy.checks.map((check, index) => (
                                    <div
                                        key={`${check.rule}-${index}`}
                                        className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950/70 p-3"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-slate-200">
                                                {check.rule.replaceAll("_", " ")}
                                            </p>

                                            {check.missedViolation && (
                                                <p className="mt-1 text-xs text-amber-400">
                                                    The policy system missed this violation.
                                                </p>
                                            )}
                                        </div>

                                        <span
                                            className={`shrink-0 text-xs font-semibold ${
                                                check.passed
                                                    ? "text-emerald-400"
                                                    : "text-red-400"
                                            }`}
                                        >
                                            {check.passed ? "PASSED" : "FAILED"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="mt-3 text-sm text-slate-500">
                                No individual policy checks recorded.
                            </p>
                        )}

                        {policy.violations &&
                            policy.violations.length > 0 && (
                                <div className="mt-5 space-y-2">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Violations detected
                                    </p>

                                    {policy.violations.map(
                                        (violation, index) => (
                                            <div
                                                key={`${violation.code}-${index}`}
                                                className="rounded-lg border border-red-900/70 bg-red-950/30 p-3"
                                            >
                                                <p className="text-sm font-semibold text-red-400">
                                                    {violation.code.replaceAll(
                                                        "_",
                                                        " ",
                                                    )}
                                                </p>

                                                <p className="mt-1 text-sm leading-5 text-slate-300">
                                                    {violation.message}
                                                </p>

                                                <p className="mt-2 text-xs text-slate-500">
                                                    Configured reputation penalty:{" "}
                                                    <span className="font-medium text-slate-300">
                                                        {violation.reputationPenalty}
                                                    </span>
                                                </p>
                                            </div>
                                        ),
                                    )}
                                </div>
                            )}
                    </DetailSection>

                    {/* Resource changes */}
                    <DetailSection title="Resource changes">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <ResourceSummary
                                label="Cash"
                                before={decision.cashBefore}
                                after={decision.cashAfter}
                            />

                            <ResourceSummary
                                label="Food"
                                before={decision.foodBefore}
                                after={decision.foodAfter}
                            />

                            <ResourceSummary
                                label="Reputation"
                                before={decision.reputationBefore}
                                after={decision.reputationAfter}
                            />
                        </div>
                    </DetailSection>

                    {/* Reputation effects */}
                    <DetailSection title="Reputation effects">
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-sm text-slate-400">
                                Penalty actually applied
                            </span>

                            <span
                                className={`text-sm font-semibold ${
                                    decision.reputationPenalty > 0
                                        ? "text-red-400"
                                        : "text-slate-300"
                                }`}
                            >
                                {decision.reputationPenalty}
                            </span>
                        </div>

                        <div className="mt-2 flex items-center justify-between gap-3">
                            <span className="text-sm text-slate-400">
                                Net reputation change
                            </span>

                            <span className="text-sm font-medium tabular-nums text-slate-200">
                                {decision.reputationAfter -
                                    decision.reputationBefore}
                            </span>
                        </div>
                    </DetailSection>

                    <p className="break-all text-xs text-slate-600">
                        Decision ID: {decision.id}
                    </p>
                </div>
            </section>
        </div>
    );
}

function DetailSection({
                           title,
                           children,
                       }: {
    title: string;
    children: ReactNode;
}) {
    return (
        <section className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {title}
            </h3>

            {children}
        </section>
    );
}

function ResourceSummary({
                             label,
                             before,
                             after,
                         }: {
    label: string;
    before: number;
    after: number;
}) {
    const difference = after - before;

    const changeColor =
        difference > 0
            ? "text-emerald-400"
            : difference < 0
                ? "text-red-400"
                : "text-slate-500";

    return (
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
            <p className="text-xs text-slate-400">{label}</p>

            <p className="mt-2 text-sm font-semibold tabular-nums text-white">
                {before} <span className="text-slate-500">→</span> {after}
            </p>

            <p className={`mt-1 text-xs font-medium ${changeColor}`}>
                {difference > 0 ? "+" : ""}
                {difference}
            </p>
        </div>
    );
}