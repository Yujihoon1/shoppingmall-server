const express = require("express");
const router = express.Router();

router.get("/:userNum", (req, res) => {
  const user = {
    user_num: req.params.userNum,
    user_name: req.params.userName,
  };

  const userInfo = {
    userId: user.user_id,
    userNum: user.user_num,
  };
  console.log(user, "mypageRoute");
  res.json(userInfo);
});

module.exports = router;
