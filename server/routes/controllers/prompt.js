const Prompt = require("./models/prompt");
const SearchHistory = require("./models/searchhistory");
const User = require("./models/user");
const config = require("../../config");
const { normalizeErrors } = require("./helpers/mongoose");
const { Anthropic } = require("@anthropic-ai/sdk");
const anthropic = new Anthropic({ apiKey: config.CLAUDE_API_KEY });

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

exports.postPrompt = async function (req, res) {
  const content =
    "あなたは優秀な編集者としてこの文章が誤解なく伝わるように校正しなさい。「以下のように校正いたしました。」等の返答は不要です。\n" +
    "#条件\n" +
    "句読点が適切か\n" +
    "誤字脱字\n" +
    "一文は60字以内\n" +
    "主述の対応\n\n" +
    req.body.prompt;

  try {
    const msg = await anthropic.messages.create({
      max_tokens: 258, // (100*2 + 58) 1 token = 3文字
      messages: [{ role: "user", content }],
      model: "claude-3-haiku-20240307",
    });
    return res.json(msg.content[0]);
  } catch (err) {
    return res.status(422).send(err);
  }
};
