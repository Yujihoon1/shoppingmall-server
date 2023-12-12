const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const db = require("./db");
const User = require("./Models/User");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

db.authenticate()
  .then(() => {
    console.log("데이터베이스 연결 성공(sever.js)");
  })
  .catch((err) => {
    console.error("데이터베이스 연결 실패:", err);
  });

app.use(express.json()); // JSON 파싱 미들웨어

app.use("/users", userRoutes); // /users 경로로 들어오는 모든 요청을 UserRoutes에서 처리

app.post("/users", async (req, res) => {
  const newUser = await User.create(req.body);
  res.json(newUser);
});
