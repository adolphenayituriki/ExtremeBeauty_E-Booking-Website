const AuditLog = require('../models/AuditLog');

const getAuditLogs = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 100, 500);
    const logs = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAuditLogs };
