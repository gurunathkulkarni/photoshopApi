const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, require: true },
    imageUrl: {type: Object},
    isDeleted: {type: Boolean, default: false}
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const bannerModel = new mongoose.model("banner", bannerSchema);
module.exports = bannerModel;
