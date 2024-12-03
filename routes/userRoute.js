const express = require("express");
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const router = express.Router();

// 사용자 생성
router.post("/", async (req, res) => {
  const { user_id, password, user_name } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      user_id,
      password: hashedPassword,
      user_name,
    });
    res.status(201).json(newUser);
  } catch (err) {
    console.error("사용자 생성 오류:", err);
    res.status(500).json({ message: "사용자 생성에 실패했습니다." });
  }
});

// 모든 사용자 목록 조회
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    console.error("사용자 목록 조회 오류:", err);
    res
      .status(500)
      .json({ message: "사용자 목록을 불러오는 데 실패했습니다." });
  }
});

// 특정 사용자 삭제
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.destroy({
      where: {
        user_num: id, // user_num을 사용하여 삭제
      },
    });

    if (!deletedUser) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }
    res.status(200).json({ message: "사용자가 삭제되었습니다." });
  } catch (err) {
    console.error("사용자 삭제 오류:", err);
    res.status(500).json({ message: "사용자 삭제에 실패했습니다." });
  }
});

// 특정 사용자 수정
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { user_name, user_id, user_grade } = req.body;

  try {
    const [updated] = await User.update(
      { user_name, user_id, user_grade },
      {
        where: { user_num: id },
      }
    );

    if (!updated) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    // 수정된 사용자 정보를 다시 가져오기
    const updatedUser = await User.findOne({ where: { user_num: id } });
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("사용자 수정 오류:", err);
    res.status(500).json({ message: "사용자 수정에 실패했습니다." });
  }
});

module.exports = router;
