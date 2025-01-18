const express = require("express");


const router = express.Router();


const {uploadImage} = require("../controllers/imageController");
const {authenticate} = require("../middlewares/authMiddleware");
const {analysisCon} = require("../controllers/analysisCon");
router.post("/upload",uploadImage);
router.post("/analysis",analysisCon);

module.exports = router;
