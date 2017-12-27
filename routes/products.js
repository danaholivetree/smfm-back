var express = require('express');
var router = express.Router();
var knex = require('../knex')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/:id', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next) {
  console.log('req.body in products/post ', req.body)
  const {sellerId, name, quantity, price, description, category} = req.body
  //add error handling for missing fields
  const product = {seller_id: sellerId, item_name: name, quantity, price, description, category}
  knex('products')
    .insert(product)
    .returning('*')
    .then( newProduct => {
      res.setHeader('Content-type', 'application/json')
      res.send(JSON.stringify(newProduct))
    })

})
module.exports = router;
