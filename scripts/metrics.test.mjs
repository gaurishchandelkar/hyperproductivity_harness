import assert from "node:assert/strict";
import { test } from "node:test";

import { countSignals, summarise } from "./metrics.mjs";

const day = (n, hour = 0) => new Date(Date.UTC(2026, 0, n, hour));

test("summarise computes duration, first-pass rate and rework", () => {
  const result = summarise(
    {
      specAdded: day(1),
      planApproved: day(2),
      planDone: day(3),
      subjects: ["greet: phase 1 - a", "greet: phase 2 - b", "greet: fix lint", "other: phase 1"],
      specEdits: [day(1), day(2, 12)],
    },
    "greet",
  );

  assert.deepEqual(result, {
    feature: "greet",
    "spec→done (h)": "48.0",
    phases: 2,
    "fix-ups": 1,
    "first-pass rate": "50%",
    "spec rework": 1,
  });
});

test("summarise reports unfinished features as in progress", () => {
  const result = summarise(
    { specAdded: day(1), planApproved: null, planDone: null, subjects: [], specEdits: [] },
    "x",
  );

  assert.equal(result["spec→done (h)"], "in progress");
  assert.equal(result["first-pass rate"], "-");
});

test("countSignals counts dated entries and escaped defects", () => {
  const log = [
    "## YYYY-MM-DD: format example",
    "## 2026-01-02: a",
    "- Signal: escaped defect",
    "## 2026-01-01: b",
    "- Signal: security issue",
  ].join("\n");

  assert.deepEqual(countSignals(log), { entries: 2, escapedDefects: 1 });
});
