require("dotenv").config();

const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;
const db = require("./db");
const cors = require("cors");
const session = require("express-session");
const User = require("./Models/User");
const userRoute = require("./routes/userRoute");
const loginRoute = require("./routes/loginRoute");
const paymentsRoute = require("./routes/paymentsRoute");
const myinfoRoute = require("./routes/myinfoRoute");
const orderRoute = require("./routes/orderRoute");
const mypageRoute = require("./routes/mypageRoute");
const productRoute = require("./routes/productRoute");
const promotionRoute = require("./routes/promotionManagementRoute");
const categoryRoute = require("./routes/categoryRoute");
const cartRoute = require("./routes/cartRoute");
const Promotion = require("./Models/Promotions");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      sameSite: "none",
      secure: false, // 개발 환경에서는 false, 배포 환경에서는 true
    },
  })
);

app.use(express.json()); // JSON 파싱 미들웨어

app.use("/users", userRoute); // '/users' 경로로 들어오는 모든 요청을 userRoute에서 처리
app.use("/login", loginRoute); // '/login' 경로로 들어오는 모든 요청을 loginRoute에서 처리
app.use("/payments", paymentsRoute);
app.use("/myinfos", myinfoRoute);
app.use("/orders", orderRoute);
app.use("/mypage", mypageRoute);
app.use("/products", productRoute);
app.use("/promotions", promotionRoute);
app.use("/category", categoryRoute);
app.use("/cart", cartRoute);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

db.authenticate()
  .then(() => {
    console.log("데이터베이스 연결 성공(sever.js)");
  })
  .catch((err) => {
    console.error("데이터베이스 연결 실패:", err);
  });

// app.post("/users", async (req, res) => {
//   const newUser = await User.create(req.body);
//   res.json(newUser);
// });

const cron = require("node-cron");
const { Op } = require("sequelize");

// 매일 자정에 실행되는 작업 스케줄링
cron.schedule("0 0 * * *", async () => {
  const today = new Date();
  try {
    // 현재 날짜가 프로모션 기간 내에 있는지 체크하고, 상태 업데이트
    // 활성화 조건에 맞는 프로모션을 활성화
    await Promotion.update(
      { promotion_is_visible: true },
      {
        where: {
          promotion_start_date: {
            [Op.lte]: today,
          },
          promotion_end_date: {
            [Op.gte]: today,
          },
          promotion_is_visible: false, // 기존에 비활성화된 프로모션만 대상으로 합니다.
        },
      }
    );
    // 만료된 프로모션을 비활성화
    await Promotion.update(
      { promotion_is_visible: false },
      {
        where: {
          [Op.or]: [
            { promotion_start_date: { [Op.gt]: today } },
            { promotion_end_date: { [Op.lt]: today } },
          ],
          promotion_is_visible: true, // 기존에 활성화된 프로모션만 대상으로 합니다.
        },
      }
    );
  } catch (error) {
    console.error("Error updating promotion visibility:", error);
  }
});
