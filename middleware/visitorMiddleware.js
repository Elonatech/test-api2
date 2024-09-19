const Visitor = require("../models/visitorModel");

const logVisitor = async (req, res, next) => {
  try {
    const visitorData = {
      ipAddress: req.ip,
      userAgent: req.get("User-Agent")
    };

    await Visitor.create(visitorData);
    next();
  } catch (error) {
    console.error("Error logging visitor:", error);
    next();
  }
};

module.exports = logVisitor;
