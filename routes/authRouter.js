const { Router } = require("express");
const { handleSignUp } = require("../controllers/authController");

const authRouter = Router();

authRouter.get("/sign-up", (req, res) => {
  res.render("sign-up");
});

authRouter.post("/sign-up", handleSignUp);

module.exports = authRouter;
