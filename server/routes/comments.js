const express = require("express");
const router = express.Router();

const UserCtrl = require("./controllers/user");
const CommentCtrl = require("./controllers/comment");

router.get("", CommentCtrl.getRandomComments);

router.post("", UserCtrl.authMiddleware, CommentCtrl.postComment);

router.patch("", UserCtrl.authMiddleware, CommentCtrl.editComment);

module.exports = router;
