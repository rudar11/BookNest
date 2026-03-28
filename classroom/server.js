const express = require("express");
const app = express();
const users = require("./routes/user");
const posts = require("./routes/post");
const cookieParser = require("cookie-parser");


app.use(cookieParser("secretcode"))

app.get("/getsignedcookie", (req, res) => {
  res.cookie("made-in", "India", { signed: true });
  res.send("signed cookie sent");
});

app.get("/verify", (req, res) => {
  console.log(req.signedCookies);
  res.send("verified");
});




app.get("/getcookies", (req, res) => {
  res.cookie("greet", "hello");
  res.send("sent you some cookies!");
})

app.get("/", (req, res) => {
  res.send("Hi, I am root!");
});

app.use("/users", users);
app.use("/posts", posts);

app.listen(3000, () => {
  console.log("server is listening to 3000");
});