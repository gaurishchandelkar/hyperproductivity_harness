import { useEffect, useState } from "react";

import { fetchGreeting } from "./api";

type State =
  | { status: "loading" }
  | { status: "ready"; message: string }
  | { status: "error"; error: string };

export function App() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    fetchGreeting()
      .then((greeting) => setState({ status: "ready", message: greeting.message }))
      .catch((error: unknown) => setState({ status: "error", error: String(error) }));
  }, []);

  return (
    <main>
      {state.status === "loading" && <p>Loading…</p>}
      {state.status === "ready" && <h1>{state.message}</h1>}
      {state.status === "error" && <p role="alert">Could not load greeting: {state.error}</p>}
    </main>
  );
}
