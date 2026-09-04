module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (req.user.role !== "driver") {
    return res.status(403).json({ message: "Driver access only" });
  }

  next();
};
