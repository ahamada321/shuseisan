const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const searchSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  query: String,
});

module.exports = mongoose.model("SearchHistory", searchSchema);
