const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401); // authorization 헤더가 없는 경우

  const token = authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401); // 토큰이 없는 경우

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403); // 토큰이 유효하지 않은 경우
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
