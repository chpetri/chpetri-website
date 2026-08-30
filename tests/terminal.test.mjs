import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { COMMANDS, executeCommand } from "../terminal.js";

test("exposes the fixed command allowlist", () => {
  assert.deepEqual(COMMANDS, [
    "help",
    "about",
    "whoami",
    "experience",
    "skills",
    "certs",
    "evidence",
    "education",
    "contact",
    "cat cv.txt",
    "cv",
    "open cv",
    "projects",
    "open projects",
    "clear",
  ]);
});

test("returns safe output for every informational command", () => {
  for (const command of COMMANDS.slice(0, 11)) {
    const result = executeCommand(command);
    assert.equal(result.type, "output");
    assert.ok(result.lines.length > 0, `${command} should return content`);
    assert.ok(result.lines.every((line) => typeof line === "string"));
  }
});

test("normalises harmless whitespace and letter case", () => {
  assert.deepEqual(executeCommand("  CAT   CV.TXT  "), executeCommand("cat cv.txt"));
});

test("keeps concise aliases on the same verified output", () => {
  assert.deepEqual(executeCommand("about"), executeCommand("whoami"));
  assert.deepEqual(executeCommand("evidence"), executeCommand("certs"));
});

test("returns the approved profile and CV summary copy", () => {
  assert.deepEqual(executeCommand("whoami").lines, [
    "Christian Petri",
    "IT Security · Networks · Systems · Darmstadt, Germany",
    "Background: technical support, systems & network security",
  ]);
  assert.deepEqual(executeCommand("cat cv.txt").lines, [
    "PROFILE",
    "Practical background in hardware diagnostics and technical support,",
    "combined with full-time training in IT security and networking.",
    "Curated bilingual profile: open cv (or click 'CV' in top nav)",
  ]);
  assert.deepEqual(executeCommand("cv").lines, [
    "CURRICULUM VITAE — SUMMARY",
    "Christian Petri · IT Security · Networks · Systems · Darmstadt, Germany",
    "Practical background in technical support & full-time IT security training.",
    "",
    "• Direct commands: experience · skills · certs · education · contact",
    "• Curated bilingual profile & printable view: open cv (or click 'CV' in top nav)",
  ]);
});

test("returns only allowlisted relative navigation targets", () => {
  assert.deepEqual(executeCommand("open cv"), { type: "navigate", href: "./cv/" });
  assert.deepEqual(executeCommand("open projects"), { type: "navigate", href: "./projects/" });
  assert.notEqual(executeCommand("https://example.com").type, "navigate");
});

test("does not navigate for commands outside the published allowlist", () => {
  for (const command of ["goto cv", "goto projects", "/cv/"]) {
    assert.equal(executeCommand(command).type, "output");
  }
});

test("handles clear, empty, invalid, long, and unknown input", () => {
  assert.deepEqual(executeCommand("clear"), { type: "clear" });
  assert.deepEqual(executeCommand("   "), { type: "output", lines: [] });
  assert.match(executeCommand(null).lines[0], /must be text/);
  assert.match(executeCommand("x".repeat(81)).lines[0], /exceeds 80/);
  assert.deepEqual(executeCommand("sudo anything"), {
    type: "output",
    lines: ["command not found: sudo anything", "Type help for available commands."],
  });
});

test("terminal source avoids executable text and network sinks", async () => {
  const source = await readFile(new URL("../terminal.js", import.meta.url), "utf8");
  assert.doesNotMatch(source, /\beval\s*\(|\bFunction\s*\(|\.innerHTML\b|\bfetch\s*\(/);
  assert.match(source, /textContent = text/);
});
