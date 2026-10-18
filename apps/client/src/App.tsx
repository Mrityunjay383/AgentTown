import {AgentCard} from "./features/world/components/AgentCard";
import {useWorld} from "./features/world/hooks/useWorld";

function App() {
    const {
        world,
        error,
        isLoading,
        refreshWorld,
        advanceTick,
    } = useWorld();

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


                        <div className="flex items-center gap-3">
                            {world && (
                                <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2">
                                    <span className="text-sm text-slate-400">Tick </span>
                                    <span className="font-mono font-semibold text-cyan-400">
                                        {world.tick}
                                    </span>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => void refreshWorld()}
                                disabled={isLoading}
                                className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-500 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isLoading ? "Refreshing..." : "Refresh"}
                            </button>

                            <button
                                onClick={() => void advanceTick()}
                                disabled={isLoading}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Advance Tick
                            </button>
                        </div>

                    </div>

                    {error && (
                        <div className="mt-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
                            Failed to load world: {error}
                        </div>
                    )}

                    {isLoading && !world && (
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
                        <div className="mt-6">
                            <AgentCard agent={mira}/>
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
