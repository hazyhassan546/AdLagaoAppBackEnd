const jwt = require("jsonwebtoken");
const config = require("config");
module.exports = function (req, res, next) {
  // get token from header
  const token = req.header("Authorization");
  // check if it exist

  if (!token) {
    return res
      .status(401)
      .json({ msg: "Token not found, Authorization denied" });
  }

  // now validate token
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    req.user = decoded.user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ msg: "Invalid Token, Authorization is denied" });
  }
};
