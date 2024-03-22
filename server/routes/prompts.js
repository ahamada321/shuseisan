const express = require("express");
const router = express.Router();

const UserCtrl = require("./controllers/user");
const PromptCtrl = require("./controllers/prompt");

// router.get("/secret", UserCtrl.authMiddleware, function (req, res) {
//   res.json({ secret: true });
// });

router.get("", PromptCtrl.getPrompts);

router.post("", PromptCtrl.postPrompt);

router.patch("/:id", UserCtrl.authMiddleware, PromptCtrl.updatePrompt);

router.delete("/:id", UserCtrl.authMiddleware, PromptCtrl.deletePrompt);

module.exports = router;
