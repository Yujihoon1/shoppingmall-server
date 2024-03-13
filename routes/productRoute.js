const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { Product, getProductByNum } = require("../Models/Products");
const Category = require("../Models/Category");

// 파일 저장을 위한 Multer 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // 파일이 저장될 경로
  },
  filename: function (req, file, cb) {
    // 파일명 설정: 현재 시간을 밀리초로 표현 + 원본 파일의 확장자
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

// `multer` 인스턴스 생성, 이미지 파일만 처리하도록 설정
const upload = multer({ storage: storage });

// 모든 상품 정보를 찾음
router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error("제품 검색 중 오류:", error);
    res.status(500).json({ error: "내부 서버 오류" });
  }
});

// 제품 추가 라우트
router.post("/", upload.single("product_image"), async (req, res) => {
  try {
    const { product_name, product_price, product_content, category_id, stock } =
      req.body;
    let product_image_path = null;

    // 파일이 업로드 되었다면 경로를 저장합니다.
    if (req.file) {
      product_image_path = req.file.path;
    }

    // Product 모델에 데이터 저장
    const newProduct = await Product.create({
      product_name,
      product_price: parseFloat(product_price), // 가격은 숫자 형태로 변환
      product_content,
      category_id,
      product_image: product_image_path,
      stock: parseInt(stock, 10), // 재고는 정수 형태로 변환
    });

    // 생성된 제품 정보 응답
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 프로덕트의 카테고리 불러오기
router.get("/category", async (req, res) => {
  try {
    const category = await Category.findAll();
    res.json(category);
  } catch (error) {
    console.error("카테고리 추가 오류- productRoute", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 특정 번호의 제품 정보를 불러옴
router.get("/:productNum", async (req, res) => {
  try {
    console.log(req.params.productNum);
    const productNum = req.params.productNum;
    const product = await Product.findOne({
      where: { product_num: productNum },
      include: Category,
    });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "상품 정보 없음" });
    }
  } catch (error) {
    console.error("제품 검색 중 오류:", error);
    res.status(500).json({ error: "내부 서버 오류" });
  }
});

router.put("/:productNum", upload.single("product_image"), async (req, res) => {
  try {
    const productNum = req.params.productNum;

    const product = await Product.findOne({
      where: { product_num: productNum },
    });

    if (!product) {
      return res.status(404).json({ error: "상품 정보 없음" });
    }

    let product_image_path = product.product_image;

    // 파일이 업로드 되었다면 경로를 저장합니다.
    if (req.file) {
      product_image_path = req.file.path;
    }

    await Product.update(
      {
        ...req.body,
        product_image: product_image_path,
        category_id:
          req.body.category_id !== ""
            ? req.body.category_id
            : product.category_id,
      },
      {
        where: { product_num: productNum },
      }
    );

    const updatedProduct = await Product.findOne({
      where: { product_num: productNum },
      include: Category,
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
