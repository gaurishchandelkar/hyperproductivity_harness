import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { App } from "./App";
import { fetchGreeting } from "./api";

vi.mock("./api");

describe("App", () => {
  it("shows loading, then the greeting as the heading", async () => {
    vi.mocked(fetchGreeting).mockResolvedValue({ message: "Hello, World!" });

    render(<App />);

    expect(screen.getByText("Loading…")).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "Hello, World!" })).toBeInTheDocument();
  });

  it("shows an alert when the greeting cannot be loaded", async () => {
    vi.mocked(fetchGreeting).mockRejectedValue(new Error("boom"));

    render(<App />);

    expect(await screen.findByRole("alert")).toHaveTextContent("Could not load greeting");
  });
});
