const fs = require("fs/promises");
const path = require("path");
const csvtoJson = require("csvtojson");
const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");
const os = require("os");

const NUM_WORKERS = os.cpus().length;
const CHUNK_SIZE = 1000; // Adjust this based on your data size and system capabilities

async function loadData(csvFilePath) {
  const csvJson = await csvtoJson().fromFile(csvFilePath);
  return csvJson;
}

async function runWorker(data, workerIndex) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(__filename, {
      workerData: { data, workerIndex },
    });
    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) {
        reject(
          new Error(`Worker ${workerIndex} stopped with exit code ${code}`)
        );
      }
    });
  });
}

async function processChunk(chunk) {
  const grammarify = require("grammarify");
  let processedChunk = [];

  for (let message of chunk) {
    let newText;
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
    processedChunk.push(newMsg);
  }

  return processedChunk;
}

if (isMainThread) {
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
      const chunks = [];
      for (let i = 0; i < messages.length; i += CHUNK_SIZE) {
        chunks.push({ index: i, data: messages.slice(i, i + CHUNK_SIZE) });
      }

      channels[channelName] = [];

      const workerPromises = chunks.map((chunk) => {
        return runWorker(chunk.data, chunk.index)
          .then((result) => ({ channelName, index: chunk.index, data: result }))
          .catch((err) => ({ channelName, index: chunk.index, error: err }));
      });

      const results = await Promise.all(workerPromises);

      results
        .sort((a, b) => a.index - b.index)
        .forEach((result) => {
          if (result.error) {
            console.error(
              `Error processing chunk ${result.index} for channel ${result.channelName}:`,
              result.error
            );
          } else {
            if (Array.isArray(result.data)) {
              channels[result.channelName].push(...result.data);
            } else {
              //console.error("Unexpected result structure:", result);
            }
          }
        });
    }

    return channels;
  }

  runAnalysis()
    .then((channels) => {
      //console.log("Processed channels data:", channels);
      console.log(channels["aristotian"].length);
    })
    .catch((error) => {
      console.error("An error occurred in the analysis:", error);
    });
} else {
  processChunk(workerData.data)
    .then((processedChunk) => {
      parentPort.postMessage(processedChunk);
    })
    .catch((err) => {
      parentPort.postMessage({ error: err.message });
    });
}
