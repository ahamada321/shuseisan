const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const promptSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isShared: { type: Boolean, default: false },

  name: {
    type: String,
    max: [30, "Too long, max is 30 characters."],
    required: "プロンプト名の入力は必須です",
  },
  categories: [{ id: Number, itemName: String }],
  description: String,
  usage: String,
  example: String,
  prompt: String,
  image: String,
  rating: Number,

  isBookmarkedFrom: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  isCopiedFrom: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: "プロンプト作成者の紐付けに失敗しました",
  },
});

module.exports = mongoose.model("Prompt", promptSchema);
