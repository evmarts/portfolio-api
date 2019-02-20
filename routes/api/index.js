var express = require("express");
var router = express.Router();
var networkRoute = require("./network");

router.use("/network", networkRoute);

console.log("starting api...");
module.exports = router;
