const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    ipAddress: String, //'',
    deviceId: String, // profile.id,
    userLink: String, // profile.id,
    appsflyer_id: String, //'', //
    advertiserTrackingId: String, // idfa
    affiliateLink: String,
    role: {
      type: String,
      default: "User", // "User" and "Admin"
      // default:
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
