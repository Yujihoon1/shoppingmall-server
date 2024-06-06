const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db");
const Product = require("./Products");

const Category = sequelize.define(
  "Category",
  {
    category_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    freezeTableName: true, // 테이블 이름을 변경하지 않음
    tableName: `category`,
    timestamps: false,
  }
);

module.exports = Category;
