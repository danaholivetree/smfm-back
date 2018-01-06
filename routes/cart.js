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
    .select('*')
    .where('user_id', req.params.id)
    .then( cartItems => {
      // console.log('bookmarks ', bookmarks);
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

  console.log('req.body in bookmarks/post ', req.body)
  const {userId, productId} = req.body
  let sendCartItem = {userId, productId}
  //add error handling for missing fields
  const newCartItem = {user_id: userId, product_id: productId}
  knex('bookmarks')
    .insert(newCartItem)
    .returning('*')
    .first()
    .then( newCartItem => {
      console.log('newcartitem in db ', newCartItem);
      sendCartItem.cartId = newCartItem.id
      return knex('products')
        .select('*')
        .where('id', productId)
        .first()
        .then( product => {
          sendCartItem.id = product.id
          sendCartItem.itemName = product.item_name
          sendCartItem.category = product.category
          sendCartItem.description = product.description
          sendCartItem.price = product.price
          sendCartItem.quantity = product.quantity
          sendCartItem.image = product.image
          res.setHeader('Content-type', 'application/json')
          res.send(JSON.stringify(sendCartItem))
        })

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
