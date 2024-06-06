const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db");
const Category = require("./Category");
const Cart = require("./Cart");

const Product = sequelize.define(
  "Product",
  {
    product_num: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    product_image: {
      type: DataTypes.STRING,
    },
    product_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    product_content: {
      type: DataTypes.STRING,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0, // 기본 재고량을 0으로 설정
    },
  },
  {
    timestamps: false,
  }
);

async function getProductByNum(product_num) {
  try {
    const product = await Product.findByPk(product_num);
    console.log(product);
    return product;
  } catch (error) {
    console.error("Error retrieving product:", error);
    throw error;
  }
}

// 제품 테이블에 category_id 외래 키 추가
Product.belongsTo(Category, { foreignKey: "category_id" });
// 카테고리 테이블은 여러 제품을 가짐
Category.hasMany(Product, { foreignKey: "category_id" });

Product.hasMany(Cart, {
  foreignKey: "product_num",
});
Cart.belongsTo(Product, { foreignKey: "product_num" });

module.exports = { Product, getProductByNum };
