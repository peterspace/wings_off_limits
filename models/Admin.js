const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    ipAddress: String, //'',
    deviceId: String, // profile.id,
    adminLink: String, // profile.id,
    appsflyer_id: String, //'', //
    advertiserTrackingId: String, // idfa
    affiliateLink: String,
    role: {
      type: String,
      default: "admin", // "admin" and "Admin"
      // default:
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
