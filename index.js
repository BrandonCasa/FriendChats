const fs = require("fs/promises");
const path = require("path");
const csvtoJson = require("csvtojson");
const grammarify = require("grammarify");
const { Worker } = require("worker_threads");

async function loadData(csvFilePath) {
  const csvJson = await csvtoJson().fromFile(csvFilePath);
  return csvJson;
}

async function runAnalysis() {
  const directoryPath = path.join(__dirname, "data");

  const dirFs = await fs.readdir(directoryPath);

  let csvData = {};

  for (let fileName of dirFs) {
    const filePath = path.join(__dirname, "data", fileName);
    csvData[fileName.substring(0, fileName.length - 4)] = await loadData(
      filePath
    );
  }

  const chatChannels = Object.keys(csvData);
  let channels = {};

  for (let channelName of chatChannels) {
    const messages = csvData[channelName];
    channels[channelName] = [];
    for (let message of messages) {
      let newText = message["Content"];

      try {
        newText = grammarify.clean(message["Content"]);
      } catch {
        continue;
      }
      let newMsg = {
        authorId: message["AuthorID"],
        authorName: message["Author"],
        sendTime: Date.parse(message["Date"]),
        text: newText,
      };
      channels[channelName].push(newMsg);
    }
  }

  console.log(channels["aristotian"]);
}

runAnalysis();
