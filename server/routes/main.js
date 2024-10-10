const express = require("express");
const router = express.Router();
const { getCardByType } = require("../controllers/cardController");

// ROUTE FOR HOMEPAGE
router.get("/", (req, res) => {
  res.render("index", { card: null });
});

// ROUTE FOR GETTING CARD BY TYPE
router.post("/getCard", getCardByType);

module.exports = router;
