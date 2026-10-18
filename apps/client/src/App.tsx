import { AgentCard } from "./features/world/components/AgentCard";
import { DecisionHistory } from "./features/world/components/DecisionHistory";
import { useWorld } from "./features/world/hooks/useWorld";
import { useWorldHistory } from "./features/world/hooks/useWorldHistory";

function App() {
    const {
        world,
        error,
        isLoading,
        refreshWorld,
        advanceTick,
    } = useWorld();

    const {
        history,
        error: historyError,
        isLoading: isHistoryLoading,
        refreshHistory,
    } = useWorldHistory();

    const mira = world?.agents.find(
        (agent) => agent.id === "agent-mira",
    );

    async function handleAdvanceTick() {
        await advanceTick();
        await refreshHistory();
    }

    return (
        <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-[1600px] space-y-8">
                {/* Header */}
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

                {/* Main dashboard layout */}
                <div className=" grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(340px,2fr)]">
                    {/* Left: World Overview */}
                    <section className="min-w-0 space-y-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    World Overview
                                </h2>

                                <p className="mt-1 text-sm text-slate-400">
                                    Monitor agents and control the simulation.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                {world && (
                                    <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2">
                                        <span className="text-sm text-slate-400">
                                            Tick{" "}
                                        </span>

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
                                    type="button"
                                    onClick={() => void handleAdvanceTick()}
                                    disabled={isLoading}
                                    className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isLoading ? "Advancing..." : "Advance Tick"}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
                                Failed to load world: {error}
                            </div>
                        )}

                        {isLoading && !world && (
                            <p className="animate-pulse text-slate-400">
                                Loading world...
                            </p>
                        )}

                        {world && !mira && (
                            <p className="text-slate-400">
                                No agent named Mira was found in this world.
                            </p>
                        )}

                        <div className="h-[70vh] overflow-y-auto flex flex-col gap-4">
                            {mira && <AgentCard agent={mira} />}
                        </div>

                    </section>

                    {/* Right: Decision History */}
                    <aside className="min-w-0 lg:sticky lg:top-6 ">
                        <DecisionHistory
                            history={history}
                            isLoading={isHistoryLoading}
                            error={historyError}
                        />
                    </aside>
                </div>
            </div>
        </main>
    );
}

export default App;
