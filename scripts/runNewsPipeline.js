console.log("NEWS PIPELINE STARTED");

import { execSync } from "child_process";

function runStep(name, command) {
  console.log(`\n--- ${name} ---`);

  try {
    execSync(command, { stdio: "inherit" });
    console.log(`${name} finished`);
  } catch (error) {
    console.error(`${name} failed`);
    console.error(error.message);
  }
}

runStep("Import Bar & Bench", "node scripts/importBarAndBenchNews.js");
runStep("Import LiveLaw", "node scripts/importLiveLawNews.js");
runStep("Generate summaries", "node scripts/generateSummaries.js");

console.log("\nNEWS PIPELINE DONE");