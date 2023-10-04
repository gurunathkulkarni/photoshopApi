const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, require: true },
    videoUrl: {type: String},
    imageUrl: {type: String},
    isDeleted: {type: Boolean, default: false}
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const videoModel = new mongoose.model("video", videoSchema);
module.exports = videoModel;