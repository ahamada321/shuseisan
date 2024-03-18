const User = require("./models/user");
const Prompt = require("./models/prompt");
const { normalizeErrors } = require("./helpers/mongoose");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const MailerLite = require("@mailerlite/mailerlite-nodejs").default;
const mailerlite = new MailerLite({
  api_key: config.ML_API_KEY,
});

exports.getBookmarks = async function (req, res) {
  const user = res.locals.user;

  try {
    const foundUser = await User.findOne({ _id: user._id }).populate({
      path: "bookmarks",
      populate: { path: "user", select: "-email -password" },
    });
    return res.json(foundUser.bookmarks);
  } catch (err) {
    return res.status(422).send({ errors: normalizeErrors(err.errors) });
  }
};

exports.getHistories = async function (req, res) {
  const user = res.locals.user;

  try {
    const foundUser = await User.findOne({ _id: user._id }).populate({
      path: "histories",
      populate: { path: "user", select: "-email -password" },
    });
    return res.json(foundUser.histories);
  } catch (err) {
    return res.status(422).send({ errors: normalizeErrors(err.errors) });
  }
};

exports.addBookmark = async function (req, res) {
  const reqPromptId = req.params.id;
  const user = res.locals.user;

  try {
    await User.updateOne(
      { _id: user._id },
      { $push: { bookmarks: reqPromptId } }
    );
    await Prompt.updateOne(
      { _id: reqPromptId },
      { $push: { isBookmarkedFrom: user._id } }
    );

    return res.json({ ok: true });
  } catch (err) {
    return res.status(422).send({ errors: normalizeErrors(err.errors) });
  }
};

exports.addHistory = async function (req, res) {
  const reqPromptId = req.params.id;
  const user = res.locals.user;

  try {
    await User.updateOne(
      { _id: user._id },
      { $pull: { histories: reqPromptId } }
    );
    await User.updateOne(
      { _id: user._id },
      { $push: { histories: reqPromptId } }
    );
    await Prompt.updateOne(
      { _id: reqPromptId },
      { $pull: { isCopiedFrom: user._id } }
    );
    await Prompt.updateOne(
      { _id: reqPromptId },
      { $push: { isCopiedFrom: user._id } }
    );

    return res.json({ ok: true });
  } catch (err) {
    return res.status(422).send({ errors: normalizeErrors(err.errors) });
  }
};

exports.deleteBookmark = async function (req, res) {
  const reqPromptId = req.params.id;
  const user = res.locals.user;

  try {
    await User.updateOne(
      { _id: user._id },
      { $pull: { bookmarks: reqPromptId } }
    );
    await Prompt.updateOne(
      { _id: reqPromptId },
      { $pull: { isBookmarkedFrom: user._id } }
    );

    return res.json({ status: "deleted" });
  } catch (err) {
    return res.status(422).send({ errors: normalizeErrors(err.errors) });
  }
};

exports.getUsers = function (req, res) {
  const { page, limit } = req.query;

  if (page && limit) {
    User.aggregate(
      [
        // { $match: { userRole: "User" } }, // Filtering to teachers
        { $project: { password: 0 } }, // Hide sensitive information.
        { $sort: { _id: -1 } }, // Sorting by latest user.
        {
          $facet: {
            metadata: [{ $count: "total" }, { $addFields: { page: page } }],
            foundUsers: [
              { $skip: (page - 1) * limit },
              { $limit: Number(limit) },
            ],
          },
        },
      ],
      function (err, result) {
        if (err) {
          return res.status(422).send({ errors: normalizeErrors(err.errors) });
        }
        return res.json(result);
      }
    );
  } else {
    User.find()
      // .populate('user') // Need to consider security in future.
      .select("-password")
      .exec(function (err, foundUsers) {
        return res.json(foundUsers);
      });
  }
};

exports.getUserById = async function (req, res) {
  const reqUserId = req.params.id;
  const token = req.headers.authorization;

  try {
    if (token) {
      const tokenUser = parseToken(token);
      if (reqUserId === tokenUser.userId) {
        const foundUser = await User.findOne({ _id: reqUserId }).populate(
          "prompts"
        );
        return res.json(foundUser);
      }
    }
  } catch (err) {
    if (err.name !== "TokenExpiredError") {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    }
  }

  try {
    const foundUser = await User.findOne({ _id: reqUserId })
      .select("-email -password")
      .populate({
        path: "prompts",
        match: { isShared: true },
      });
    return res.json(foundUser);
  } catch (err) {
    return res.status(422).send({ errors: normalizeErrors(err.errors) });
  }
};

exports.auth = async function (req, res) {
  const { email, password } = req.body;

  if (!password || !email) {
    return res.status(422).send({
      errors: [
        {
          title: "Data missing!",
          detail: "IDとパスワードを入力してください",
        },
      ],
    });
  }

  try {
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(422).send({
        errors: [
          { title: "Invalid user!", detail: "先にユーザー登録してください" },
        ],
      });
    }
    if (!foundUser.isVerified) {
      return res.status(422).send({
        errors: [
          {
            title: "Not active user!",
            detail: "アカウントが無効です。サポートからお問い合わせください",
          },
        ],
      });
    }
    if (!foundUser.hasSamePassword(password)) {
      return res.status(422).send({
        errors: [
          { title: "Invalid!", detail: "IDまたはパスワードが間違っています" },
        ],
      });
    }

    if (!foundUser.loginCount) {
      foundUser.loginCount = 0; //tmp
    }

    await User.updateOne(
      { _id: foundUser._id },
      { lastLogin: new Date(), loginCount: foundUser.loginCount++ }
    );
    const token = jwt.sign(
      {
        userId: foundUser.id,
        name: foundUser.name,
      },
      config.SECRET,
      { expiresIn: "12h" }
    ); // return JWT token

    return res.json(token);
  } catch (err) {
    return res.status(422).send({ errors: normalizeErrors(err.errors) });
  }
};

exports.register = async function (req, res) {
  const { name, email, password } = req.body;

  if (!name) {
    return res.status(422).send({
      errors: [
        {
          detail: "氏名を入力してください",
        },
      ],
    });
  }

  if (!email) {
    return res.status(422).send({
      errors: [
        {
          detail: "メールアドレスを入力してください",
        },
      ],
    });
  }

  const parts = email.split("@");
  const domainName = parts[1];
  if (domainName == "secretmail.net") {
    return res.status(422).send({
      errors: [
        {
          detail: "このメールアドレスは登録できません",
        },
      ],
    });
  }

  if (password.length < 5) {
    return res.status(422).send({
      errors: [
        {
          detail: "パスワードは5文字以上で入力してください",
        },
      ],
    });
  }

  // Filling user infomation with ../models/user.js format
  const user = new User(req.body);

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(422).send({
        errors: [
          {
            title: "Invalid email!",
            detail: "このメールアドレスは既に登録されています！",
          },
        ],
      });
    }
    const newUser = await User.create(user);
    const newSubscriber = await mailerlite.subscribers.createOrUpdate({
      email,
      fields: { name },
      groups: ["114047662393657295"],
      status: "active",
    });
    return res.json(newUser);
  } catch (err) {
    return res.status(422).send({ errors: normalizeErrors(err.errors) });
  }
};

exports.reset = async function (req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(422).send({
      errors: [
        {
          title: "Data missing!",
          detail: "Emailを入力してください",
        },
      ],
    });
  }

  try {
    const foundUser = await User.findOne({ email }).select("-password");
    if (!foundUser) {
      return res.status(422).send({
        errors: [
          { title: "Invalid user!", detail: "先にユーザー登録してください" },
        ],
      });
    }
    if (foundUser.isBanned) {
      return res.status(422).send({
        errors: [
          {
            title: "Not active user!",
            detail: "アカウントが無効です。サポートからお問い合わせください",
          },
        ],
      });
    }

    return res.json(foundUser);
  } catch (err) {
    return res.status(422).send({ errors: normalizeErrors(err.errors) });
  }
};

// Not completely works!
exports.deleteUser = async function (req, res) {
  const reqUserId = req.params.id;
  const user = res.locals.user; // This is logined user infomation.

  if (user.userRole !== "Owner") {
    return res.status(422).send({
      errors: {
        title: "Invalid user!",
        detail: "管理者権限がない為削除できません",
      },
    });
  }
  try {
    await User.deleteOne({ _id: reqUserId });
    return res.json({ registered: false });
  } catch (err) {
    return res.status(422).send({ errors: normalizeErrors(err.errors) });
  }
};

exports.updateUser = async function (req, res) {
  const user = res.locals.user; // This is logined user infomation.
  const userData = req.body;
  const { email, password, passwordConfirmation } = req.body;
  const reqUserId = req.params.id;

  if (reqUserId !== user.id) {
    return res.status(422).send({
      errors: {
        title: "Invalid user!",
        detail: "Cannot edit other user profile!",
      },
    });
  }

  try {
    if (!password) {
      if (email !== user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(422).send({
            errors: [
              {
                title: "Invalid email!",
                detail: "このメールアドレスは既に登録されています！",
              },
            ],
          });
        }
      }

      await User.updateOne({ _id: user.id }, userData);
      const token = jwt.sign(
        {
          userId: user.id,
          name: userData.name,
        },
        config.SECRET,
        { expiresIn: "12h" }
      );
      return res.json(token);
    } else {
      if (password !== passwordConfirmation) {
        return res.status(422).send({
          errors: [
            {
              title: "Error!",
              detail: "パスワードとパスワード（確認）が異なります",
            },
          ],
        });
      }

      const foundUser = await User.findById(user.id);
      foundUser.password = password;
      await foundUser.save();

      const token = jwt.sign(
        {
          userId: user.id,
          name: foundUser.name,
        },
        config.SECRET,
        { expiresIn: "12h" }
      );

      return res.json(token);
    }
  } catch (err) {
    return res.status(422).send({ errors: normalizeErrors(err.errors) });
  }
};

function parseToken(token) {
  // split token string [Bearer XXXXXXXXX] with ' ' and return XXXXXXXXX
  return jwt.verify(token.split(" ")[1], config.SECRET);
}

function notAuthorized(res) {
  return res.status(401).send({
    errors: [
      {
        title: "Not authorized!",
        detail: "You need to login to get access!",
      },
    ],
  });
}

exports.authMiddleware = async function (req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return notAuthorized(res);
  }
  try {
    const tokenUser = parseToken(token);
    const foundUser = await User.findById(tokenUser.userId);
    if (foundUser) {
      res.locals.user = foundUser;
      next();
    } else {
      return notAuthorized(res);
    }
  } catch (err) {
    return res.status(422).send({ errors: normalizeErrors(err.errors) });
  }
};
