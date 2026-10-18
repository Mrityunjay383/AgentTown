import type { Agent } from "../../../types/world";

type AgentCardProps = {
    agent: Agent;
};

export function AgentCard({ agent }: AgentCardProps) {
    const reputationColor =
        agent.reputation >= 70
            ? "text-emerald-400"
            : agent.reputation >= 40
                ? "text-amber-400"
                : "text-red-400";

    return (
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg transition-colors hover:border-slate-700 sm:p-6">
            {/* Agent identity */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-xl font-bold text-cyan-400">
                        {agent.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                        <h3 className="truncate text-lg font-semibold text-white">
                            {agent.name}
                        </h3>
                        <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400">
                            {agent.role.replaceAll("_", " ")}
                        </p>
                    </div>
                </div>

                <span className="shrink-0 rounded-full border border-emerald-800/70 bg-emerald-950/50 px-3 py-1 text-xs font-medium text-emerald-400">
                    Active Agent
                </span>
            </div>

            {/* Goal */}
            <div className="mt-6 rounded-xl border border-slate-800/80 bg-slate-950/50 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Current Goal
                </p>
                <p className="mt-2 text-sm font-medium text-slate-200">
                    {agent.goal.replaceAll("_", " ")}
                </p>
            </div>

            {/* Resources */}
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <StatCard
                    label="Cash"
                    value={agent.cash}
                    description="Available balance"
                    valueColor="text-emerald-400"
                />

                <StatCard
                    label="Food"
                    value={agent.inventory.food}
                    description="Inventory units"
                    valueColor="text-amber-400"
                />

                <StatCard
                    label="Reputation"
                    value={agent.reputation}
                    description="Reputation score"
                    valueColor={reputationColor}
                />
            </div>
        </section>
    );
}

type StatCardProps = {
    label: string;
    value: number;
    description: string;
    valueColor: string;
};

function StatCard({
                      label,
                      value,
                      description,
                      valueColor,
                  }: StatCardProps) {
    return (
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition-colors hover:border-slate-700">
            <p className="text-sm text-slate-400">{label}</p>

            <p className={`mt-3 text-2xl font-semibold tabular-nums ${valueColor}`}>
                {value.toLocaleString()}
            </p>

            <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>
    );
}
