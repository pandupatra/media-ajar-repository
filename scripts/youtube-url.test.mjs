import assert from "node:assert/strict";
import { getYouTubeEmbedUrl } from "../src/lib/format.ts";

assert.equal(
  getYouTubeEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ"),
  "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
);
assert.equal(
  getYouTubeEmbedUrl("https://youtu.be/dQw4w9WgXcQ"),
  "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
);
assert.equal(getYouTubeEmbedUrl("https://example.com/watch?v=dQw4w9WgXcQ"), null);

console.log("YouTube URL checks passed");
