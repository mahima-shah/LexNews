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
runStep("Import India Legal Live", "node scripts/importIndiaLegal.js");
runStep("Import Economic Times Legal", "node scripts/importEconomicTimes.js");
runStep("Import LawBeat", "node scripts/importLawBeat.js");
runStep("Import Verbatim News Network", "node scripts/importVerbatim.js");
runStep("Generate summaries", "node scripts/generateSummaries.js");

console.log("\nNEWS PIPELINE DONE");
