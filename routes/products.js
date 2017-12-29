var express = require('express');
var router = express.Router();
var knex = require('../knex')

/* GET home page. */
router.get('/', function(req, res, next) {
  return knex('products')
    .select('*')
    .then ( products => {
      res.setHeader('Content-type', 'application/json')
      res.send(JSON.stringify(products))
    })
});

router.get('/:id', function(req, res, next) {
  console.log('getting to route for products by user id, user id is ', req.params.id)
  return knex('products')
    .select('*')
    .where('seller_id', req.params.id)
    .then( products => {
      console.log('products ', products);
      if (!products[0]) {
        console.log('user has no products for sale');
        res.setHeader("Content-Type", "application/json")
        res.send(JSON.stringify({seller_id: user.id}))
      } else {
      console.log('user has products for sale ', products);
      res.setHeader("Content-Type", "application/json")
      res.send(JSON.stringify(products))
      }
    })
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
