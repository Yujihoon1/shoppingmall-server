const express = require("express");
const router = express.Router();
const Order = require("../Models/Orders");
const OrderDetail = require("../Models/OrderDetail");

// 관계 설정
Order.hasMany(OrderDetail, { foreignKey: "order_id" });
OrderDetail.belongsTo(Order, { foreignKey: "order_id" });

// 관리자페이지에서 모든 주문 목록 불러오기
router.get("/admin", async (req, res) => {
  try {
    // 주문 내역 검색
    const orders = await Order.findAll({
      include: [
        {
          model: OrderDetail,
        },
      ],
      order: [["order_id", "DESC"]],
    });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "데이터를 불러오는 데 실패했습니다." });
  }
});

// 주문 저장
router.post("/", async (req, res) => {
  const { total_price, orderDetails, user_num } = req.body;

  try {
    const newOrder = await Order.create({
      user_num: user_num,
      total_price,
    });

    for (let detail of orderDetails) {
      const { product_num, quantity } = detail;
      await OrderDetail.create({
        order_id: newOrder.order_id,
        quantity,
        product_num,
      });
    }
    console.log("주문 저장이 성공했습니다(orderRoute)");
    res.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 사용자의 전체 주문 목록 불러오기
router.get("/:usernum", async (req, res) => {
  // 로그인한 사용자의 user_num
  const user_num = req.params.usernum;

  try {
    // 주문 내역 검색 및 결제 내역 가져오기
    const orders = await Order.findAll({
      where: { user_num: user_num },
      include: [
        {
          model: OrderDetail,
          required: true,
        },
      ],
      order: [["order_id", "DESC"]],
    });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "데이터를 불러오는 데 실패했습니다." });
  }
});

// 주문 상세 정보 가져오기
router.get("/:user_num/:order_id", async (req, res) => {
  const user_num = req.params.user_num;
  const order_id = req.params.order_id;

  try {
    const order = await Order.findOne({
      where: { user_num: user_num, order_id: order_id },
      include: [
        {
          model: OrderDetail,
          as: "OrderDetails",
          required: true,
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ error: "주문을 찾을 수 없습니다." });
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "데이터를 불러오는 데 실패했습니다." });
  }
});

//주문 삭제 라우트
router.delete("/:orderId", async (req, res) => {
  const { orderId } = req.params;

  try {
    // 먼저 OrderDetail 레코드 삭제
    await OrderDetail.destroy({
      where: { order_id: orderId },
    });

    // 이후 Order 레코드 삭제
    const result = await Order.destroy({
      where: { order_id: orderId },
    });

    if (result > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "주문을 찾을 수 없습니다." });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
