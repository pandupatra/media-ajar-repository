import assert from "node:assert/strict";
import test from "node:test";
import { getHeyzineEmbedUrl } from "../src/lib/format.ts";

test("accepts only Heyzine flipbook URLs", () => {
  assert.equal(
    getHeyzineEmbedUrl("https://heyzine.com/flip-book/718e839f09.html"),
    "https://heyzine.com/flip-book/718e839f09.html",
  );
  assert.equal(getHeyzineEmbedUrl("https://heyzine.com.example.com/flip-book/718e839f09.html"), null);
  assert.equal(getHeyzineEmbedUrl("https://heyzine.com/not-a-flipbook"), null);
});
