const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("multi", "root", "1234", {
  host: "localhost",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("데이터베이스 연결 성공(db.js)");
  })
  .catch((err) => {
    console.error("데이터베이스 연결 실패:", err);
  });

module.exports = sequelize;
