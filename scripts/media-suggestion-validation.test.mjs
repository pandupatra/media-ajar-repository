import assert from "node:assert/strict";
import test from "node:test";
import { validateMediaSuggestion } from "../src/lib/validations.ts";

test("validates public media suggestions", () => {
  assert.equal(validateMediaSuggestion({
    topic: "Pecahan untuk kelas 4",
    subject: "Matematika",
    level: "Kelas 4",
    preferred_format: "video",
    notes: "Dengan contoh sehari-hari",
  }).valid, true);

  const invalid = validateMediaSuggestion({
    topic: "",
    subject: "Matematika",
    level: "Kelas 4",
    preferred_format: "exe",
  });
  assert.equal(invalid.valid, false);
  assert.deepEqual(invalid.errors.map(({ field }) => field), ["topic", "preferred_format"]);
});
