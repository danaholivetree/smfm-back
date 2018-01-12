var express = require('express');
var router = express.Router();



router.get('/:id', function(req, res, next) {
  console.log('in get seller by id route; id is ', req.params.id);
  return knex('sellers')
    .where('id', req.params.id)
    .select('sk')
})

module.exports = router;
