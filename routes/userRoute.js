const express = require("express");
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const router = express.Router();

router.post("/", async (req, res) => {
  const { user_id, password, user_name } = req.body;

  // 비밀번호 해쉬화 하기
  const hashedPassword = await bcrypt.hash(password, 10);

  // 해시화된 비밀번호로 사용자 생성
  const newUser = await User.create({
    user_id,
    password: hashedPassword,
    user_name,
  });

  res.json(newUser);
});

//test용 라우트
// router.get("/test-hash", async (req, res) => {
//   const password = "1234";
//   const hashed = await bcrypt.hash(password, 10);
//   res.send(hashed);
// });

module.exports = router;
