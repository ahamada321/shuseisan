const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reportSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  commentTo: { type: Schema.Types.ObjectId, ref: "Comment" },
  userFrom: { type: Schema.Types.ObjectId, ref: "User" },
  reportMessage: String,
});

module.exports = mongoose.model("Report", reportSchema);
