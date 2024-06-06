const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db");

const Payments = sequelize.define(
  "Payments",
  {
    Payments_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cardNumber: DataTypes.STRING,
    expiryDate: DataTypes.STRING,
    cvc: DataTypes.STRING,
    MyInfo_id: DataTypes.INTEGER,
    user_num: DataTypes.INTEGER,
  },
  {
    timestamps: false,
  }
);

module.exports = Payments;
