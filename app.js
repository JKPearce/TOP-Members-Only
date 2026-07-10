require("dotenv").config();

const express = require("express");
const path = require("node:path");
const session = require("express-session");
const passport = require("passport");

require("./config/passport");
const { getAllPosts, createPost } = require("./models/postsModel");

const authRouter = require("./routes/authRouter");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", authRouter);

app.get("/", async (req, res, next) => {
  try {
    const posts = await getAllPosts();

    res.render("index", {
      posts,
      currentUser: req.user || null,
    });
  } catch (error) {
    next(error);
  }
});

app.post("/posts", async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).send("You must be logged in to post");
    }

    const { title, body } = req.body;

    await createPost({
      title,
      body,
      userId: req.user.id,
    });

    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening on http://127.0.0.1:${PORT}`);
});
