import mongoose from 'mongoose';

const adminReportSchema = new mongoose.Schema(
  {
    reportType: {
      type: String,
      enum: ['audit', 'security_review'],
      required: true,
      index: true
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    format: {
      type: String,
      enum: ['json', 'csv'],
      default: 'json'
    },
    rangeFrom: {
      type: Date,
      default: null
    },
    rangeTo: {
      type: Date,
      default: null
    },
    downloadName: {
      type: String,
      default: null
    },
    summary: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

adminReportSchema.index({ reportType: 1, createdAt: -1 });
adminReportSchema.index({ requestedBy: 1, createdAt: -1 });

const AdminReport = mongoose.model('AdminReport', adminReportSchema);

export default AdminReport;
