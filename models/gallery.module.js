const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, require: true },
    description: { type: String, default: null },
    quotes: { type: String, default: null },
    thumbnailImgUrl: { type: Object },
    audioFileUrl: {type: Object, default: null},
    galleryImgUrls: {type: Array},
    type: {type: String, default: null}
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const galleryModel = new mongoose.model("gallery", gallerySchema);
module.exports = galleryModel;
