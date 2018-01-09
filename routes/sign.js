var express = require('express');
var router = express.Router();

/* GET auth page. */
router.get('/', function(req, res, next) {
  console.log(req.body)
})

module.exports = router;
