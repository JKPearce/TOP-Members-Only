const { Router } = require("express");
const { handleSignUp } = require("../controllers/authController");
const passport = require("passport");
const { makeUserMember } = require("../models/authModels");

const authRouter = Router();

authRouter.get("/sign-up", (req, res) => {
  res.render("sign-up");
});

authRouter.post("/sign-up", handleSignUp);

authRouter.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  }),
);

authRouter.post("/log-out", (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }

    res.redirect("/");
  });
});

authRouter.get("/join", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }

  res.render("join");
});

authRouter.post("/join", async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/");
    }

    if (req.body.memberCode !== process.env.MEMBER_CODE) {
      return res.status(400).send("Incorrect member code");
    }

    await makeUserMember(req.user.id);

    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

module.exports = authRouter;
