const Prompt = require("./models/prompt");
const SearchHistory = require("./models/searchhistory");
const User = require("./models/user");
const { normalizeErrors } = require("./helpers/mongoose");

exports.getPromptById = async function (req, res) {
  const promptId = req.params.id;

  try {
    const foundPrompt = await Prompt.findById(promptId)
      .populate("user", "-email -password")
      .populate({
        path: "comments",
        populate: { path: "user", select: "-email -password" },
        options: { sort: { createdAt: -1 } },
      });

    return res.json(foundPrompt);
  } catch (err) {
    if (err) {
      return res.status(422).send({
        errors: {
          title: "Prompt error!",
          detail: "Could not find Prompt!",
        },
      });
    }
  }
};

exports.getRandomPrompts = async function (req, res) {
  try {
    const result = await Prompt.aggregate([
      { $match: { isShared: true } },
      { $sample: { size: 4 } },
      {
        $lookup: {
          from: "users", // 結合するコレクション
          localField: "user", // rentalsコレクションのフィールド
          foreignField: "_id", // usersコレクションのフィールド
          as: "user", // 結果を格納するフィールド名
          pipeline: [
            {
              $project: {
                email: 0,
                password: 0, // パスワードフィールドを除外
              },
            },
          ],
        },
      },
      {
        $unwind: "$user",
      },
    ]);
    return res.json(result);
  } catch (err) {
    return res.status(422).send({ errors: normalizeErrors(err.errors) });
  }
};

exports.getPromptRanking = async function (req, res) {
  const { page, limit } = req.query;

  if (!page || !limit) {
    return res.status(422).send({
      errors: [
        {
          title: "Data missing!",
          detail: "ページリミット情報が取得できませんでした。",
        },
      ],
    });
  }

  try {
    const result = await Prompt.aggregate([
      { $match: { isShared: true } },
      {
        $addFields: {
          arraySize: { $size: { $ifNull: ["$isBookmarkedFrom", []] } },
        },
      },
      { $sort: { arraySize: -1 } },
      {
        $lookup: {
          from: "users", // 結合するコレクション
          localField: "user", // rentalsコレクションのフィールド
          foreignField: "_id", // usersコレクションのフィールド
          as: "user", // 結果を格納するフィールド名
          pipeline: [
            {
              $project: {
                email: 0,
                password: 0, // パスワードフィールドを除外
              },
            },
          ],
        },
      },
      {
        $unwind: "$user",
      },
      {
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page: page } }],
          foundPrompts: [
            { $skip: (page - 1) * limit },
            { $limit: Number(limit) },
          ],
        },
      },
    ]);
    return res.json(result);
  } catch (err) {
    return res.status(422).send({ errors: normalizeErrors(err.errors) });
  }
};

exports.getPrompts = async function (req, res) {
  const { keywords, page, limit } = req.query;

  if (!page || !limit) {
    return res.status(422).send({
      errors: [
        {
          title: "Data missing!",
          detail: "ページリミット情報が取得できませんでした。",
        },
      ],
    });
  }

  try {
    if (!keywords) {
      const result = await Prompt.aggregate([
        { $match: { isShared: true } },
        { $sort: { updatedAt: -1 } }, // Sorting by latest.
        {
          $lookup: {
            from: "users", // 結合するコレクション
            localField: "user", // rentalsコレクションのフィールド
            foreignField: "_id", // usersコレクションのフィールド
            as: "user", // 結果を格納するフィールド名
            pipeline: [
              {
                $project: {
                  email: 0,
                  password: 0, // パスワードフィールドを除外
                },
              },
            ],
          },
        },
        {
          $unwind: "$user",
        },
        {
          $facet: {
            metadata: [{ $count: "total" }, { $addFields: { page: page } }],
            foundPrompts: [
              { $skip: (page - 1) * limit },
              { $limit: Number(limit) },
            ],
          },
        },
      ]);
      return res.json(result);
    }

    const queries = keywords.split(/\s+/);
    const regexPatterns = queries.map((word) => new RegExp(word, "i"));

    for (const query of queries) {
      await SearchHistory.create({ query });
    }

    const result = await Prompt.aggregate([
      {
        $match: {
          isShared: true,
          $or: [
            { name: { $in: regexPatterns } },
            { description: { $in: regexPatterns } },
            { "categories.itemName": { $in: regexPatterns } },
          ],
        },
      },
      {
        $addFields: {
          arraySize: { $size: { $ifNull: ["$isBookmarkedFrom", []] } },
        },
      },
      { $sort: { arraySize: -1 } },
      {
        $lookup: {
          from: "users", // 結合するコレクション
          localField: "user", // rentalsコレクションのフィールド
          foreignField: "_id", // usersコレクションのフィールド
          as: "user", // 結果を格納するフィールド名
          pipeline: [
            {
              $project: {
                email: 0,
                password: 0, // パスワードフィールドを除外
              },
            },
          ],
        },
      },
      {
        $unwind: "$user",
      },
      {
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page: page } }],
          foundPrompts: [
            { $skip: (page - 1) * limit },
            { $limit: Number(limit) },
          ],
        },
      },
    ]);
    return res.json(result);
  } catch (err) {
    return res.status(422).send({ errors: normalizeErrors(err.errors) });
  }
};

exports.getMyPrompts = async function (req, res) {
  const user = res.locals.user;
  const { page, limit } = req.query;

  if (!page || !limit) {
    return res.status(422).send({
      errors: [
        {
          title: "Data missing!",
          detail: "ページリミット情報が取得できませんでした。",
        },
      ],
    });
  }

  try {
    const result = await Prompt.aggregate([
      { $match: { user: user._id } },
      { $sort: { updatedAt: -1 } },
      {
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page: page } }],
          foundPrompts: [
            { $skip: (page - 1) * limit },
            { $limit: Number(limit) },
          ],
        },
      },
    ]);
    return res.json(result);
  } catch (err) {
    return res.status(422).send({ errors: normalizeErrors(err.errors) });
  }
};

exports.deletePrompt = async function (req, res) {
  const promptId = req.params.id;
  const user = res.locals.user;

  try {
    const foundPrompt = await Prompt.findById(promptId).populate("user");
    if (foundPrompt.user.id !== user.id) {
      return res.status(422).send({
        errors: [
          {
            title: "Can't delete prompt!",
            detail: "他ユーザーのプロンプトは削除できません",
          },
        ],
      });
    }

    await User.updateOne(
      { _id: user._id },
      { $pull: { prompts: foundPrompt._id } }
    ); // Delete prompt from User

    await foundPrompt.deleteOne();
    return res.json({ status: "deleted" });
  } catch (err) {
    return res.status(422).send({ errors: normalizeErrors(err.errors) });
  }
};

exports.updatePrompt = async function (req, res) {
  const promptData = req.body;
  const promptId = req.params.id;
  const user = res.locals.user;

  try {
    const foundPrompt = await Prompt.findById(promptId).populate("user");
    if (foundPrompt.user.id !== user.id) {
      return res.status(422).send({
        errors: [
          {
            title: "Can't update prompt!",
            detail: "他ユーザーのプロンプトは更新できません",
          },
        ],
      });
    }

    // await User.updateOne(
    //   { _id: user._id },
    //   { $push: { prompts: foundPrompt._id } }
    // ); // No needed. Already attached with user when created.

    promptData.updatedAt = new Date();
    await Prompt.updateOne({ _id: foundPrompt._id }, promptData);
    return res.json({ status: "updated" });
  } catch (err) {
    return res.status(422).send({ errors: normalizeErrors(err.errors) });
  }
};

exports.createPrompt = async function (req, res) {
  const promptData = new Prompt(req.body);
  const user = res.locals.user;
  promptData.user = user;

  try {
    const newPrompt = await Prompt.create(promptData);
    await User.updateOne({ _id: user.id }, { $push: { prompts: newPrompt } });
    return res.json({ status: "created" });
  } catch (err) {
    return res.status(422).send({ errors: normalizeErrors(err.errors) });
  }
};
