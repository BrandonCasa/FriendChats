import fs from "fs";
import friendChats from "./friendchats";

async function runAnalysis(friendChats) {
  const directoryPath = path.join(__dirname, "data");

  dirFS = await fs.readdirSync;
  friendChats.loadData();
}

output = runAnalysis(friendChats);
