const mongoose = require("mongoose");

const happyCustomerSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    message: { type: String },
    imageUrl: {type: Object}
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const happyCustomerModel = new mongoose.model("happyCustomer", happyCustomerSchema);
module.exports = happyCustomerModel;