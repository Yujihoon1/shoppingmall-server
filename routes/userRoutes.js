const express = require("express");
const User = require("../Models/User");
const router = express.Router();

router.post("/users", async (req, res) => {
  const newUser = await User.create(req.body);
  res.json(newUser);
});

module.exports = router;
