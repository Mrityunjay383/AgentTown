
import { useEffect, useState } from "react";
import { getWorld } from "./api/world.api";
import type {WorldState} from "./types/world.ts";

function App() {
    const [world, setWorld] = useState<WorldState | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadWorld() {
            try {
                const data = await getWorld();
                setWorld(data);
            } catch (err: unknown) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Unable to load world",
                );
            }
        }

        void loadWorld();
    }, []);

    const mira = world?.agents.find((agent) => agent.id === "agent-mira");

    return (
        <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-10">
            <div className="mx-auto max-w-5xl space-y-10">
                <header className="border-b border-slate-800 pb-6">
                    <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-400">
                        Autonomous Simulation
                    </p>
                    <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                        AgentTown
                    </h1>
                    <p className="mt-3 text-slate-400">
                        Autonomous agents. A living virtual economy.
                    </p>
                </header>

                <section>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-semibold">World Overview</h2>
                            <p className="mt-1 text-sm text-slate-400">
                                Current simulation state
                            </p>
                        </div>

                        {world && (
                            <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2">
                                <span className="text-sm text-slate-400">Tick </span>
                                <span className="font-mono font-semibold text-cyan-400">
                                    {world.tick}
                                </span>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="mt-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
                            Failed to load world: {error}
                        </div>
                    )}

                    {!world && !error && (
                        <p className="mt-6 animate-pulse text-slate-400">
                            Loading world...
                        </p>
                    )}

                    {world && !mira && (
                        <p className="mt-6 text-slate-400">
                            No agent named Mira was found in this world.
                        </p>
                    )}

                    {mira && (
                        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl sm:p-8">
                            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-xl font-bold text-cyan-400">
                                            {mira.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold">
                                                {mira.name}
                                            </h3>
                                            <p className="mt-1 text-sm text-slate-400">
                                                {mira.role.replaceAll("_", " ")}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <span className="w-fit rounded-full border border-emerald-800 bg-emerald-950/50 px-3 py-1 text-xs font-medium text-emerald-400">
                                    Active Agent
                                </span>
                            </div>

                            <div className="mt-8">
                                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                    Current Goal
                                </p>
                                <p className="mt-2 text-sm font-medium text-slate-200">
                                    {mira.goal.replaceAll("_", " ")}
                                </p>
                            </div>

                            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
                                    <p className="text-sm text-slate-400">Cash</p>
                                    <p className="mt-3 text-3xl font-semibold tabular-nums">
                                        {mira.cash}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Available balance
                                    </p>
                                </div>

                                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
                                    <p className="text-sm text-slate-400">Food</p>
                                    <p className="mt-3 text-3xl font-semibold tabular-nums">
                                        {mira.inventory.food}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Inventory units
                                    </p>
                                </div>

                                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
                                    <p className="text-sm text-slate-400">Reputation</p>
                                    <p className="mt-3 text-3xl font-semibold tabular-nums">
                                        {mira.reputation}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Reputation score
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                <footer className="border-t border-slate-800 pt-5 text-xs text-slate-500">
                    AgentTown · Simulation Dashboard
                </footer>
            </div>
        </main>
    );
}

export default App;
