// promotionsRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Promotion = require("../Models/Promotions");
const PromotionDetail = require("../Models/PromotionDetail");
const { Op } = require("sequelize");

Promotion.hasMany(PromotionDetail, {
  foreignKey: "promotion_id",
  as: "promotionImages", // 관계를 나타내는 별칭
});
PromotionDetail.belongsTo(Promotion, {
  foreignKey: "promotion_id",
});

// 파일 저장을 위한 Multer 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // 파일이 저장될 경로
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // 파일명 설정
  },
});

// `multer` 인스턴스 생성
const upload = multer({ storage: storage });

// 모든 프로모션을 가져오는 라우트
router.get("/", async (req, res) => {
  try {
    const promotions = await Promotion.findAll();
    res.json(promotions);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// 프로모션을 생성하는 라우트
router.post(
  "/",
  upload.fields([
    { name: "bannerImage", maxCount: 1 },
    { name: "contentImages", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const { title, content, startDate, endDate } = req.body;
      const today = new Date();

      // 오늘 날짜가 시작일과 종료일 사이인지 확인
      const isVisible =
        new Date(startDate) <= today && today <= new Date(endDate);

      const bannerImagePath = req.files["bannerImage"]
        ? req.files["bannerImage"][0].path
        : null;
      const contentImagesPaths = req.files["contentImages"]
        ? req.files["contentImages"].map((file) => file.path)
        : [];

      // Promotion 모델에 데이터 저장
      const newPromotion = await Promotion.create({
        promotion_title: title,
        promotion_content: content,
        promotion_is_visible: isVisible,
        promotion_start_date: startDate,
        promotion_end_date: endDate,
        promotion_banner_image_path: bannerImagePath,
      });

      // PromotionDetails 모델에 데이터 저장
      for (let imagePath of contentImagesPaths) {
        await PromotionDetail.create({
          promotion_id: newPromotion.promotion_id,
          promotion_image_path: imagePath,
        });
      }

      res.status(201).json(newPromotion);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

// 활성화된 프로모션을 가져오는 라우트
router.get("/active", async (req, res) => {
  const { date } = req.query; // 클라이언트로부터 전달된 'date' 쿼리 파라미터

  try {
    // 현재 날짜에 활성화된 프로모션만 필터링
    const activePromotions = await Promotion.findAll({
      where: {
        promotion_is_visible: true,
        promotion_start_date: {
          [Op.lte]: new Date(date).setHours(23, 59, 59, 999), // 시작일이 오늘 날짜보다 이전
        },
        promotion_end_date: {
          [Op.gte]: new Date(date).setHours(0, 0, 0, 0), // 종료일이 오늘 날짜보다 이후
        },
      },
    });

    res.json(activePromotions);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// 특정 프로모션을 가져오는 라우트
router.get("/:promotionId", async (req, res) => {
  const { promotionId } = req.params;
  try {
    const promotion = await Promotion.findByPk(promotionId, {
      include: [
        {
          model: PromotionDetail,
          as: "promotionImages",
        },
      ],
    });

    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found." });
    }

    res.json(promotion);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// 프로모션을 수정하는 라우트
router.put(
  "/:promotionId",
  upload.fields([
    { name: "bannerImage", maxCount: 1 },
    { name: "contentImages", maxCount: 10 },
  ]),
  async (req, res) => {
    const { promotionId } = req.params;
    const { title, content, isVisible, startDate, endDate } = req.body;

    try {
      // 기존 프로모션 정보를 가져옵니다.
      const promotion = await Promotion.findByPk(promotionId);
      if (!promotion) {
        return res.status(404).json({ message: "Promotion not found." });
      }

      let bannerImagePath = promotion.promotion_banner_image_path;
      if (req.files["bannerImage"]) {
        bannerImagePath = req.files["bannerImage"][0].path;
      }

      // 프로모션 정보를 업데이트합니다.
      await Promotion.update(
        {
          promotion_title: title,
          promotion_content: content,
          promotion_is_visible: isVisible === "true",
          promotion_start_date: startDate,
          promotion_end_date: endDate,
          promotion_banner_image_path: bannerImagePath,
        },
        {
          where: { promotion_id: promotionId },
        }
      );

      // 컨텐트 이미지들을 업데이트합니다.
      if (req.files["contentImages"]) {
        const contentImagesPaths = req.files["contentImages"].map(
          (file) => file.path
        );

        // 기존 이미지들을 삭제합니다.
        await PromotionDetail.destroy({
          where: { promotion_id: promotionId },
        });

        // 새 이미지 경로들을 PromotionDetail에 추가합니다.
        const newPromotionDetails = contentImagesPaths.map((imagePath) => ({
          promotion_id: promotionId,
          promotion_image_path: imagePath,
        }));
        await PromotionDetail.bulkCreate(newPromotionDetails);
      }

      res.json({ message: "Promotion updated successfully." });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

// 프로모션을 삭제하는 라우트
router.delete("/:promotionId", async (req, res) => {
  const { promotionId } = req.params;
  try {
    await Promotion.destroy({
      where: { promotion_id: promotionId },
    });
    res.json({ message: "Promotion deleted successfully." });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
