const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("../Models/User");

const MyInfo = sequelize.define(
  "MyInfo",
  {
    MyInfo_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    user_num: DataTypes.INTEGER,
  },
  {
    timestamps: false,
  }
);

//관계 설정은 모델 정의 후에 해야함
MyInfo.belongsTo(User, {
  foreignKey: "user_num",
  targetKey: "user_num",
});

module.exports = MyInfo;
