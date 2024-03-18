const express = require("express");
const mongoose = require("mongoose");
const compression = require("compression");
const path = require("path");
const config = require("./config");

const promptRoutes = require("./routes/prompts");
const userRoutes = require("./routes/users");
const paymentRoutes = require("./routes/payments");
const commentRoutes = require("./routes/comments");
const contactformRoutes = require("./routes/contactforms");
// const imageUploadRoutes = require("./routes/image-upload");
// const FakeDb = require("./template-data/fake-db");

mongoose
  .connect(config.DB_URI, {})
  .then(() => {
    if (process.env.NODE_ENV !== "production") {
      // const fakeDb = new FakeDb();
      // fakeDb.seeDb();
    }
  })
  .catch((err) => console.error(err));

const app = express();
app.use(compression()); // compress middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/prompts", promptRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/contactforms", contactformRoutes);
// app.use("/api/v1", imageUploadRoutes);

if (process.env.NODE_ENV === "production") {
  const appPath = path.join(__dirname, "..", "dist", "shuseisan");

  const redirectToHttpsAndWww = (req, res, next) => {
    if (req.headers["x-forwarded-proto"] !== "https") {
      const httpsUrl = "https://" + req.headers.host + req.url;
      return res.redirect(301, httpsUrl);
    }
    if (req.url === "/ads.txt") {
      // /ads.txt へのリクエストの場合はwww.へリダイレクトしない
      return next();
    }
    if (!req.headers.host.startsWith("www.")) {
      const wwwUrl = "https://www." + req.headers.host + req.url;
      return res.redirect(301, wwwUrl);
    }
    next();
  };
  app.use(redirectToHttpsAndWww);

  app.use(express.static(appPath));
  app.get("*", function (req, res) {
    res.sendFile(path.resolve(appPath, "index.html"));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, function () {
  console.log("I am running");
});
