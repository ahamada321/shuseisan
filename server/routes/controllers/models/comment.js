const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  comment: { type: String, required: "コメントは必須です" },
  // updatedAt: Date,
  // isReported: [{ type: Schema.Types.ObjectId, ref: "Report" }],
  prompt: {
    type: Schema.Types.ObjectId,
    ref: "Prompt",
    required: "プロンプト情報は必須です",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: "ユーザー情報は必須です",
  },
});

module.exports = mongoose.model("Comment", commentSchema);
