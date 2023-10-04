const mongoose = require("mongoose");

const contactusSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    phone_number: { type: String },
    message: { type: String },
    email: { type: String },
    checkbox: {type: Array},
    eventLocation: {type: String},
    howDidYouHear: {type: String}
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const contactusModel = new mongoose.model("contactus", contactusSchema);
module.exports = contactusModel;