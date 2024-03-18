const express = require("express");
const router = express.Router();

const UserCtrl = require("./controllers/user");

router.post("/auth", UserCtrl.auth);

router.post("/register", UserCtrl.register);

router.post("/reset", UserCtrl.reset);

router.get("/bookmark/:id", UserCtrl.authMiddleware, UserCtrl.addBookmark);

router.get("/history/:id", UserCtrl.authMiddleware, UserCtrl.addHistory);

router.get("/bookmark", UserCtrl.authMiddleware, UserCtrl.getBookmarks);

router.get("/history", UserCtrl.authMiddleware, UserCtrl.getHistories);

router.get("/:id", UserCtrl.getUserById);

// router.get("", UserCtrl.getUsers);

router.patch("/:id", UserCtrl.authMiddleware, UserCtrl.updateUser);

router.delete(
  "/bookmark/:id",
  UserCtrl.authMiddleware,
  UserCtrl.deleteBookmark
);

router.delete("/:id", UserCtrl.authMiddleware, UserCtrl.deleteUser);

module.exports = router;
