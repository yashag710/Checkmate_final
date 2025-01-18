const express = require("express");


const router = express.Router();


const {uploadImage} = require("../controllers/imageController");
const {authenticate} = require("../middlewares/authMiddleware");

router.post("/upload",uploadImage);


module.exports = router;