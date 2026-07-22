import assert from "node:assert/strict";
import test from "node:test";
import { getCanvaEmbedUrl } from "../src/lib/format.ts";

test("normalizes Canva share links for embedding", () => {
  assert.equal(
    getCanvaEmbedUrl("https://www.canva.com/design/DAGabc123/Share_Token/edit?utm_content=DAGabc123"),
    "https://www.canva.com/design/DAGabc123/Share_Token/view?embed",
  );
  assert.equal(
    getCanvaEmbedUrl("https://www.canva.com/design/DAGabc123/view?utm_source=share"),
    "https://www.canva.com/design/DAGabc123/view?embed",
  );
  assert.equal(getCanvaEmbedUrl("https://canva.com.example.com/design/DAGabc123/view"), null);
  assert.equal(getCanvaEmbedUrl("https://www.canva.com/templates/DAGabc123"), null);
});
