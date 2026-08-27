const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  adminName: { type: String, trim: true },
  adminEmail: { type: String, trim: true, lowercase: true },
  role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' },
  action: { type: String, required: true, trim: true },
  entity: { type: String, required: true, trim: true },
  entityId: { type: String, trim: true },
  details: { type: mongoose.Schema.Types.Mixed },
}, {
  timestamps: true,
});

auditSchema.index({ createdAt: -1 });
auditSchema.index({ admin: 1 });

module.exports = mongoose.model('AuditLog', auditSchema);
