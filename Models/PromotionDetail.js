const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db");

const PromotionDetail = sequelize.define(
  "PromotionDetail",
  {
    promotion_image_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    promotion_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Promotions", // Promotion 모델을 참조
        key: "promotion_id", // Promotion 모델의 'promotion_id' 필드를 참조
      },
      onDelete: "CASCADE", // Promotion이 삭제될 때 함께 삭제되도록 설정
    },
    promotion_image_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = PromotionDetail;
