var express = require('express');
var router = express.Router();
var knex = require('../knex')


router.get('/', function(req, res, next) {
  return knex('cart')
    .select('*')
    .then ( cartItems => {
      res.setHeader('Content-type', 'application/json')
      res.send(JSON.stringify(cartItems))
    })
});

router.get('/:id', function(req, res, next) {
  console.log('getting to route for cart by user id, user id is ', req.params.id)
  return knex('cart')
    .select('cart.id as id','products.id as productId', 'seller_id as sellerId' ,'item_name as itemName', 'description', 'category', 'price', 'quantity', 'cart_quantity as cartQuantity', 'name as sellerName', 'image_url', 'sold', 'purchaser_id')
    .where('user_id', req.params.id)
    .innerJoin('products', 'cart.product_id', 'products.id')
    .innerJoin('users', 'users.id', 'products.seller_id')
    .then( cartItems => {
      if (!cartItems[0]) {
        console.log('user has no items in cart');
        res.setHeader("Content-Type", "application/json")
        res.send(JSON.stringify([]))
      } else {
      console.log('user has shopping cart ', cartItems);
      res.setHeader("Content-Type", "application/json")
      res.send(JSON.stringify(cartItems))
      }
    })
});

router.post('/', function(req, res, next) {
  const {productId, userId} = req.body
  console.log('req.body ', productId, userId);
  //add error handling for missing fields
  const cartItem = {user_id: userId, product_id: productId, }
  console.log('cartItem ', cartItem) //correct
  return knex('cart')
    .insert(cartItem)
    .innerJoin('products', 'cart.product_id', 'products.id')
    .select('products.id as productId', 'seller_id as sellerId', 'item_name as itemName', 'description', 'category', 'price', 'quantity',  'image_url as image', 'sold', 'purchaser_id as purchasedBy')
    .innerJoin('users', 'users.id', 'products.seller_id')
    .select('name as sellerName')
    .first()
    .then( newCartItem => {
      console.log('new cart item info from db ', newCartItem);
      res.setHeader('Content-type', 'application/json')
      res.send(JSON.stringify(newCartItem))
    })
})

router.delete('/:id', function(req, res, next) {
  console.log('cartItem to delete ', req.params.id)
  knex('cart')
    .del()
    .where('id', req.params.id)
    .then( deleted => {
      res.setHeader('Content-type', 'application/json')
      res.send(JSON.stringify(deleted))
    })
})
module.exports = router;
