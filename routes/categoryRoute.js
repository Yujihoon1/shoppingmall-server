const express = require("express");
const router = express.Router();
const { Product } = require("../Models/Products");
const Category = require("../Models/Category");

// 모든 카테고리 목록 조회
router.get("/", async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    console.error("카테고리 조회 중 오류:", error);
    res.status(500).json({ error: "내부 서버 오류" });
  }
});

// 카테고리별 상품 목록 조회
router.get("/:categoryId", async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const products = await Product.findAll({
      where: { category_id: categoryId },
      include: Category,
    });
    if (products) {
      res.json(products);
    } else {
      res.status(404).json({ error: "상품 정보 없음" });
    }
  } catch (error) {
    console.error("제품 검색 중 오류:", error);
    res.status(500).json({ error: "내부 서버 오류" });
  }
});

module.exports = router;
