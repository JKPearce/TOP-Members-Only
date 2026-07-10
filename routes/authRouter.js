const { Router } = require("express");
const { handleSignUp } = require("../controllers/authController");
const passport = require("passport");

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

module.exports = authRouter;
