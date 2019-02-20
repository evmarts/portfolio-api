var express = require("express");
var router = express.Router();
var cors = require("cors");
router.use(cors());
const knex = require("../../database");

router.post("/", async (req, res) => {
  console.log(req.body)
  res.sendStatus(200)
});

module.exports = router;
