const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db");

const OrderDetail = sequelize.define(
  "OrderDetail",
  {
    order_detail_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_num: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    order_id: {
      type: DataTypes.INTEGER,
    },
    product_num: {
      type: DataTypes.INTEGER,
    },
    quantity: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = OrderDetail;
