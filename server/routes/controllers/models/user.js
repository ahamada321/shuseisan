const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date,
  loginCount: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: true },
  isReported: [{ type: Schema.Types.ObjectId, ref: "Report" }],

  name: {
    type: String,
    max: [30, "Too long, max is 30 characters."],
    min: [4, "Too short, min is 4 characters."],
    required: "name is required",
  },
  email: {
    type: String,
    max: [60, "Too long, max is 60 characters."],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "メールアドレスを正しく入力してください",
    ],
    required: "Email is required",
  },
  password: {
    type: String,
    max: [32, "Too long, max is 32 characters."],
    min: [4, "Too short, min is 4 characters."],
    required: "Password is required",
  },
  description: String,
  image: String,
  stripe: String,

  homepage: String,
  twitter: String,

  bookmarks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Prompt",
    },
  ],
  histories: [
    {
      type: Schema.Types.ObjectId,
      ref: "Prompt",
    },
  ],
  prompts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Prompt",
    },
  ],
  newsletter: { type: Boolean, default: true },
});

userSchema.methods.hasSamePassword = function (requestPassword) {
  return bcrypt.compareSync(requestPassword, this.password);
};

userSchema.pre("save", function (next) {
  const user = this;

  // Skip if user didn't update user password
  if (user.password) {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(user.password, salt, function (err, hash) {
        // Store hash in your password DB.
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

module.exports = mongoose.model("User", userSchema);
