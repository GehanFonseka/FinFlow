const express = require("express");
const { getFinancialAdvice } = require("../controllers/adviceController");

const router = express.Router();

router.post("/", getFinancialAdvice);

module.exports = router;
