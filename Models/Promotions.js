const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db");

const Promotion = sequelize.define(
  "Promotion",
  {
    promotion_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    promotion_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    promotion_content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    promotion_is_visible: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    promotion_start_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    promotion_end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    promotion_banner_image_path: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Promotion;
