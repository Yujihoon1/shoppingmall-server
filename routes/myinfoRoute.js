const express = require("express");
const MyInfo = require("../Models/MyInfo");
const router = express.Router();

// 모든 MyInfo 데이터를 가져오는 라우트
router.get("/", async (req, res) => {
  try {
    const myInfos = await MyInfo.findAll();
    res.json(myInfos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 특정 MyInfo 데이터를 가져오는 라우트
router.get("/:id", async (req, res) => {
  try {
    const myInfo = await MyInfo.findByPk(req.params.id);
    if (myInfo) {
      res.json(myInfo);
    } else {
      res.status(404).json({ error: "MyInfo not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 새로운 MyInfo 데이터를 생성하는 라우트
router.post("/", async (req, res) => {
  try {
    const newMyInfo = await MyInfo.create(req.body);
    res.status(201).json(newMyInfo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 기존 MyInfo 데이터를 업데이트하는 라우트
router.put("/:id", async (req, res) => {
  try {
    const updatedMyInfo = await MyInfo.update(req.body, {
      where: { MyInfo_id: req.params.id },
    });

    if (updatedMyInfo) {
      res.json({ message: "MyInfo updated successfully" });
    } else {
      res.status(404).json({ error: "MyInfo not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// MyInfo 데이터를 삭제하는 라우트
router.delete("/:id", async (req, res) => {
  try {
    const result = await MyInfo.destroy({
      where: { MyInfo_id: req.params.id },
    });

    if (result) {
      res.json({ message: "MyInfo deleted successfully" });
    } else {
      res.status(404).json({ error: "MyInfo not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
