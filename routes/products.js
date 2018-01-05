var express = require('express');
var router = express.Router();
var knex = require('../knex')

/* GET all products */
router.get('/', function(req, res, next) {
  return knex('products')
    .select('products.id as id', 'seller_id as sellerId' ,'item_name as itemName', 'description', 'category', 'price', 'quantity', 'name as sellerName', 'image_url as image', 'sold', 'purchaser_id as purchaserId')
    .innerJoin('users', 'users.id', 'products.seller_id')
    .then ( products => {
      res.setHeader('Content-type', 'application/json')
      res.send(JSON.stringify(products))
    })
});

//post new product
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

//edit a product
router.put('/:id', function(req, res, next) {
  console.log('getting to route for editing single item, item id is', req.params.id, ' and req.body is ', req.body)
  const {name, category, description, price, quantity} = req.body
  return knex('products')
    .update({name, category, description, price, quantity}, ['id', 'name', 'category', 'description', 'price', 'quantity'])
    .where('id', req.params.id)
    .then( product => {
      console.log('edited product ', product)
      res.setHeader("Content-Type", "application/json")
      res.send(JSON.stringify(product))
    })
})

router.delete('/:id', function(req, res, next) {
  let itemToDelete;
  knex('products')
    .select('*')
    .first()
    .where('id', req.params.id)
    .then( item => {
      itemToDelete = item
      return knex('products')
        .del()
        .where('id', req.params.id)
        .then( deleted => {
          console.log('deleted ', deleted);
          console.log('item to delete ', itemToDelete);
          res.setHeader("Content-Type", "application/json")
          res.send(JSON.stringify(itemToDelete))
        })
    })
})

module.exports = router;
