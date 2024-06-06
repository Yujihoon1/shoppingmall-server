const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db");

const Orders = sequelize.define(
  "Orders",
  {
    order_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_num: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
    },
    // 총 가격 가상 필드
    total_price_int: {
      type: DataTypes.VIRTUAL,
      get() {
        return Math.round(this.total_price); // total_price를 반올림
      },
    },
    order_date: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
    // 주문 날짜 가상 필드
    order_date_format: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.order_date.toISOString().slice(0, 19).replace("T", " ");
        // 초 단위까지만 나오게 조정
      },
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Orders;
