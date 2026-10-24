import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchGreeting } from "./api";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchGreeting", () => {
  it("returns the greeting from /api/hello", async () => {
    const fetchMock = vi.fn(() => Promise.resolve(Response.json({ message: "Hi" })));
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchGreeting()).resolves.toEqual({ message: "Hi" });
    expect(fetchMock).toHaveBeenCalledWith("/api/hello");
  });

  it("throws when the request fails", async () => {
    vi.stubGlobal("fetch", () => Promise.resolve(new Response(null, { status: 500 })));

    await expect(fetchGreeting()).rejects.toThrow("Request failed: 500");
  });
});
