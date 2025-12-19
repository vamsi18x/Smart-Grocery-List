const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

// Get all items for a user
router.get("/:userId", async (req, res) => {
  try {
    const items = await Item.find({ userId: req.params.userId });
    res.json(items);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Add new item
router.post("/", async (req, res) => {
  try {
    const item = new Item({
      name: req.body.name,
      category: req.body.category,
      userId: req.body.userId,
      checked: false,
      quantity: 1,
      dateBought: new Date()
    });
    const savedItem = await item.save();
    res.json(savedItem);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update item checked status or quantity
router.put("/:id", async (req, res) => {
  try {
    const updated = await Item.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete item
router.delete("/:id", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
