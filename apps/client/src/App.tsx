
import { useEffect, useState } from "react";

type HealthResponse = {
    status: string;
    service: string;
};

function App() {
    const [health, setHealth] = useState<HealthResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL;

        fetch(`${apiUrl}/health`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Server returned ${response.status}`);
                }

                return response.json() as Promise<HealthResponse>;
            })
            .then(setHealth)
            .catch((err: unknown) => {
                setError(
                    err instanceof Error ? err.message : "Unable to connect to server",
                );
            });
    }, []);

    return (
        <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
            <h1>AgentTown</h1>
            <p>Autonomous agents. A living virtual economy.</p>

            <h2>Backend connection</h2>

            {health && (
                <p>
                    Connected: {health.service} — {health.status}
                </p>
            )}

            {error && <p>Connection failed: {error}</p>}

            {!health && !error && <p>Connecting to server...</p>}
        </main>
    );
}

export default App;
