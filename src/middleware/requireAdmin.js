module.exports = (req, res, next) => {
  if (!req.admin) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  if (req.admin.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
};
