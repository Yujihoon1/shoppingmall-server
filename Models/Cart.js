const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./User");
const { Product } = require("./Products");

const Cart = sequelize.define(
  "Cart",
  {
    cart_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_num: DataTypes.INTEGER,
    product_num: DataTypes.INTEGER,
  },
  {
    timestamps: false,
    tableName: "Cart",
  }
);

Cart.belongsTo(User, { foreignKey: "user_num", targetKey: "user_num" });

module.exports = Cart;
