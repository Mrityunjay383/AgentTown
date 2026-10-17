import type { Agent } from "../../../types/world";

type AgentCardProps = {
    agent: Agent;
};

export function AgentCard({ agent }: AgentCardProps) {
    return (
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl sm:p-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-xl font-bold text-cyan-400">
                        {agent.name.charAt(0)}
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold">{agent.name}</h3>
                        <p className="mt-1 text-sm text-slate-400">
                            {agent.role.replaceAll("_", " ")}
                        </p>
                    </div>
                </div>

                <span className="w-fit rounded-full border border-emerald-800 bg-emerald-950/50 px-3 py-1 text-xs font-medium text-emerald-400">
                    Agent
                </span>
            </div>

            <div className="mt-8">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Current Goal
                </p>
                <p className="mt-2 text-sm font-medium text-slate-200">
                    {agent.goal.replaceAll("_", " ")}
                </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard label="Cash" value={agent.cash} description="Available balance" />
                <StatCard label="Food" value={agent.inventory.food} description="Inventory units" />
                <StatCard label="Reputation" value={agent.reputation} description="Reputation score" />
            </div>
        </section>
    );
}

type StatCardProps = {
    label: string;
    value: number;
    description: string;
};

function StatCard({ label, value, description }: StatCardProps) {
    return (
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-3 text-3xl font-semibold tabular-nums">{value}</p>
            <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>
    );
}
