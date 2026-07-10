require("dotenv").config();

const express = require("express");
const path = require("node:path");
const authRouter = require("./routes/authRouter");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use("/", authRouter);

app.get("/", (req, res) => {
  res.render("index");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT} http://127.0.0.1:${PORT} `);
});
