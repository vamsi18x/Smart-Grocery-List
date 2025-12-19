const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

// Predict items for a user based on last month purchases
router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  try {
    const items = await Item.find({
      userId,
      dateBought: { $gte: oneMonthAgo }
    });

    const freqMap = {};
    items.forEach(i => {
      freqMap[i.name] = (freqMap[i.name] || 0) + 1;
    });

    // Recommend items bought >=2 times
    const predicted = Object.keys(freqMap).filter(name => freqMap[name] >= 2);
    res.json(predicted);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
