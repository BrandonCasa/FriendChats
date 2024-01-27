const { parentPort, workerData } = require("worker_threads");

const hashedArray = [];
// perform the CPU-intensive task here
for (const element of workerData) {
  const hash = crypto
    .createHmac("sha256", "secret")
    .update(element)
    .digest("hex");

  hashedArray.push(hash);
}

// send the hashedArray to the parent thread
parentPort.postMessage(hashedArray);
process.exit();
