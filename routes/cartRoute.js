const express = require("express");
const Cart = require("../Models/Cart"); // Cart 모델 경로를 확인하세요
const router = express.Router();
const { Product } = require("../Models/Products");
const { Sequelize } = require("sequelize");

// '/add' 경로에서 상품 추가 처리
router.post("/add", async (req, res) => {
  const { user_num, product_num, quantity } = req.body;

  try {
    const newCart = await Cart.create({
      user_num,
      product_num,
      quantity,
    });

    res.status(201).json({
      message: "장바구니에 상품이 추가되었습니다.",
      cart: newCart,
    });
  } catch (error) {
    console.error("장바구니 추가 중 오류 발생:", error);
    res.status(500).json({ message: "장바구니 추가에 실패했습니다." });
  }
});

router.get("/:user_num", async (req, res) => {
  const user_num = req.params.user_num;
  console.log("요청 받음, user_num:", user_num);

  try {
    console.log("DB 쿼리 실행 전, userNum 조건:", user_num);
    const cartItems = await Cart.findAll({
      where: { user_num: user_num },
      include: [
        {
          model: Product,
        },
      ],
    });

    res.json(cartItems);
    console.log("DB 쿼리 실행 후, cartItems:", cartItems);
  } catch (error) {
    res.status(500).send("서버 에러");
    console.error("장바구니 조회 중 오류 발생:", error);
  }
});

router.delete("/:user_num/items", async (req, res) => {
  const user_num = req.params.user_num;
  const { itemIds } = req.body;

  console.log("user_num:", user_num);
  console.log("itemIds:", itemIds); // 제대로 된 배열인지 확인

  try {
    const result = await Cart.destroy({
      where: {
        user_num: user_num,
        cart_id: {
          [Sequelize.Op.in]: itemIds, // 배열 형태의 itemIds 처리
        },
      },
    });

    console.log("삭제된 항목 수:", result);

    if (result > 0) {
      res.status(200).json({
        message: "선택된 장바구니 항목이 삭제되었습니다.",
      });
    } else {
      res.status(404).json({
        message: "삭제할 항목을 찾을 수 없습니다.",
      });
    }
  } catch (error) {
    console.error("장바구니 항목 삭제 중 오류 발생:", error);
    res.status(500).json({ message: "장바구니 항목 삭제에 실패했습니다." });
  }
});

module.exports = router;
