const bcrypt = require("bcryptjs");
const { createUser } = require("../models/authModels");

async function handleSignUp(req, res) {
  const { firstName, lastName, username, email, password, confirm_password } =
    req.body;

  if (password !== confirm_password) {
    return res.status(400).send("Passwords do not match");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await createUser({
    firstName,
    lastName,
    username,
    email,
    passwordHash,
  });

  res.redirect("/");
}
module.exports = {
  handleSignUp,
};
