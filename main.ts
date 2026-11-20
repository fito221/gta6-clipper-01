// Entry program for the GTA 6 clip bounty (gta6-clipper-01).
// Its only job: hand VIDEO.json — the YouTube address of the clip —
// to the grader by copying it into the output directory.

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const videoJson = join(repoRoot, "VIDEO.json");
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";

if (!existsSync(videoJson)) {
  console.error(`VIDEO.json not found at ${videoJson}`);
  process.exit(1);
}

let videoUrl;
try {
  videoUrl = JSON.parse(readFileSync(videoJson, "utf8")).url;
} catch {
  console.error("VIDEO.json is not valid JSON");
  process.exit(1);
}

const youtubePattern =
  /^https:\/\/(www\.|m\.)?(youtube\.com\/(shorts\/|watch\?v=)|youtu\.be\/)[A-Za-z0-9_-]{11}/;
if (typeof videoUrl !== "string" || !youtubePattern.test(videoUrl)) {
  console.error(
    `VIDEO.json url is not a YouTube video address (expected https://www.youtube.com/shorts/<id>, watch?v=<id> or youtu.be/<id>): ${videoUrl}`,
  );
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(videoJson, join(outDir, "VIDEO.json"));
console.log(`VIDEO.json copied to ${join(outDir, "VIDEO.json")}`);
