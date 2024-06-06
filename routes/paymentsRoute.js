const express = require("express");
const router = express.Router();
const MyInfo = require("../Models/MyInfo");
const Payments = require("../Models/Payments");

router.post("/", async (req, res) => {
  const { myInfo, paymentInfo, product_num } = req.body;

  try {
    const newMyInfo = await MyInfo.create(myInfo);
    const newPayment = await Payments.create({
      ...paymentInfo,
      myInfoId: newMyInfo.myInfoId,
      product_num,
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

module.exports = router;
