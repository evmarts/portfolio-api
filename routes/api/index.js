var express = require("express");
var router = express.Router();
var networkRoute = require("./network");
var messageRoute = require("./message");

router.use("/network", networkRoute);
router.use("/message", messageRoute);

console.log("starting api...");
module.exports = router;
