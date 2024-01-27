const fs = require("fs/promises");
const csvtoJson = require("csvtojson");

class FriendChats {
  constructor() {}

  async loadData(csvFilePath) {
    const csvJson = await csvtoJson().fromFile(csvFilePath);
    return csvJson;
  }
}

module.exports = FriendChats;
