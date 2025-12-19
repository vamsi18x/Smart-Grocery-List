const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  checked: { type: Boolean, default: false },
  quantity: { type: Number, default: 1 },
  dateBought: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Item", ItemSchema);
