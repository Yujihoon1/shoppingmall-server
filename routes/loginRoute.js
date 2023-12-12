const express = require("express");
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const router = express.Router();

router.post("/", async (req, res) => {
  const { user_id, password } = req.body;

  try {
    //findOne 메소드는 주어진 조건에 맞는 첫 번째 레코드를 데이터베이스에서 찾아 반환해준다
    const user = await User.findOne({ where: { user_id } });

    //해당 아이디가 없을 경우 에러코드 400 + 해당 아이디 가진 사용자 못 찾는다
    if (!user) {
      res
        .status(400)
        .json({ error: "해당 아이디를 가진 사용자를 찾을 수 없습니다." });
      return;
    }
    //회원가입 시에 bcrypt 사용하여 암호화해주었으므로 bcrypt.compare을 통해 비밀번호 맞는지 확인해준다.
    const match = await bcrypt.compare(password, user.password);

    //비밀번호가 틀리면 에러코드 400+비밀번호 일치하지 않는다
    if (!match) {
      res.status(400).json({ error: "비밀번호가 일치하지 않습니다." });
      return;
    }
    // 로그인 성공 응답
    res.status(200).json({ message: "로그인 성공", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "서버 에러" });
  }
});

module.exports = router;
