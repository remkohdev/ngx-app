var express = require('express');
var router = express.Router();

/* GET 'hello world' message. */
router.get('/hello', function(req, res, next) {
  res.json({ msg: 'hello world!' } );
});

module.exports = router;
