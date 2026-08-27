const AuditLog = require('../models/AuditLog');

async function recordAudit({ admin, action, entity, entityId, details }) {
  try {
    const entry = {
      action,
      entity,
      entityId: entityId ? String(entityId) : undefined,
      details: details || undefined,
    };
    if (admin) {
      entry.admin = admin._id;
      entry.adminName = admin.name;
      entry.adminEmail = admin.email;
      entry.role = admin.role;
    }
    await AuditLog.create(entry);
  } catch (error) {
    console.error('[Audit] Failed to record:', error.message);
  }
}

function logChange(req, action, entity, entityId, details) {
  return recordAudit({
    admin: req.admin || null,
    action,
    entity,
    entityId,
    details,
  });
}

module.exports = { recordAudit, logChange };
