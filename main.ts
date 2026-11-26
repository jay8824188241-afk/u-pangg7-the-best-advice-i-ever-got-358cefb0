// The Best Advice I Ever Got — make.fun program/v1 entry.
// Deterministically writes the entry to $MAKEFUN_OUTPUT_DIR/entry.txt,
// then reads it back and self-checks it before exiting.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY_LINES = [
  "Don't wait until you're ready — start small, and let the doing make you ready.",
  "Most of the things I was afraid to begin turned out to be the ones worth beginning.",
];

const ENTRY = ENTRY_LINES.join("\n") + "\n";

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  console.error("MAKEFUN_OUTPUT_DIR is not set");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

// Self-check: read back and verify byte-identical, non-empty,
// and every line within the 280-character limit.
const back = readFileSync(outPath, "utf8");
if (back !== ENTRY) {
  console.error("self-check failed: entry.txt differs from expected content");
  process.exit(1);
}
if (back.length === 0) {
  console.error("self-check failed: entry.txt is empty");
  process.exit(1);
}
const byteLen = Buffer.byteLength(back, "utf8");
if (byteLen !== Buffer.byteLength(ENTRY, "utf8")) {
  console.error(
    `self-check failed: byte length mismatch (${byteLen} vs ${Buffer.byteLength(ENTRY, "utf8")})`,
  );
  process.exit(1);
}
if (ENTRY_LINES.length > 5) {
  console.error("self-check failed: entry must be a few lines at most");
  process.exit(1);
}
for (const line of back.split("\n")) {
  if (line.length > 280) {
    console.error(`self-check failed: line exceeds 280 chars (${line.length})`);
    process.exit(1);
  }
}

console.log(`wrote ${outPath} (${ENTRY.length} chars)`);
