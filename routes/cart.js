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
    .select('cart.id as id','products.id as productId', 'seller_id as sellerId' ,'item_name as itemName', 'description', 'category', 'price', 'quantity', 'cart_quantity as cartQuantity', 'name as sellerName', 'image_url as image', 'thumbnail_url as thumbnail', 'sold', 'purchaser_id')
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

// router.post('/', function(req, res, next) {
//   const {productId, userId} = req.body
//   console.log('req.body ', productId, userId);
//   //add error handling for missing fields
//   const cartItem = {user_id: userId, product_id: productId, }
//   console.log('cartItem ', cartItem) //correct
//   return knex('cart')
//     .insert(cartItem, '*')
//     .innerJoin('products', 'cart.product_id', 'products.id')
//     .select('products.id as productId', 'seller_id as sellerId', 'item_name as itemName', 'description', 'category', 'price', 'quantity',  'image_url as image', 'sold', 'purchaser_id as purchasedBy')
//     .innerJoin('users', 'users.id', 'products.seller_id')
//     .select('name as sellerName')
//     .then( newCartItem => {
//       console.log('new cart item info from db ', newCartItem[0]);
//       res.setHeader('Content-type', 'application/json')
//       res.send(JSON.stringify(newCartItem[0]))
//     })
// })

router.post('/', function(req, res, next) {
  const {productId, userId} = req.body
  const cart = {user_id: userId, product_id: productId}
  console.log('post cart ', cart);
  return knex('cart')
    .where('product_id', productId)
    .andWhere('user_id', userId)
    .first()
    .then( exists => {
      if (exists) {
        return
      }
      else {
        knex('cart')
          .insert(cart, '*')
          .then( cartItem => {
            return knex('cart')
              .where('cart.id', cartItem[0].id)
              .select('cart.id as id')
              .innerJoin('products', 'cart.product_id', 'products.id')
              .select(['products.id as productId', 'seller_id as sellerId', 'item_name as itemName', 'description', 'category', 'price', 'quantity',  'image_url as image', 'thumbnail_url as thumbnail', 'sold', 'purchaser_id as purchasedBy'])
              .innerJoin('users', 'users.id', 'products.seller_id')
              .select('users.name as sellerName')
              .then( newCartItem => {
                console.log('new cartitem info from db ', newCartItem[0])
                res.setHeader('Content-type', 'application/json')
                res.send(JSON.stringify(newCartItem[0]))
            })
        })
      } //close else
    })
})

router.put('/:id', (req, res, next) => {
  let itemToEdit
  console.log('req.cartQuantity to edit in PUT cart ', req.body.cartQuantity)
  return knex('cart')
    .where('id', req.params.id)
    .select()
    .first()
    .then( edit => {
      if (!edit) { // item wasn't in cart anyway
        return //error handling later
      }
      console.log('item was in cart. id was ', req.params.id);
      console.log('req.body.cartQuantity ', req.body.cartQuantity);
      knex('cart')
        .update({cart_quantity: req.body.cartQuantity})
        .where('id', req.params.id)
        .returning(['id', 'cart_quantity as cartQuantity'])
        .then( updatedItem => {
          console.log('updateditem ', updatedItem[0]);
          res.setHeader('Content-type', 'application/json')
          res.send(JSON.stringify(updatedItem[0]))
        })
    })
})



router.delete('/:id', function(req, res, next) {
  let itemToDelete
  console.log('cartItem to delete ', req.params.id)
  return knex('cart')
    .where('id', req.params.id)
    .select()
    .first()
    .then( forDelete => {
      itemToDelete = forDelete
      knex('cart')
        .del()
        .where('id', req.params.id)
        .then( deleted => {
        console.log('deleted ', itemToDelete);
        res.setHeader('Content-type', 'application/json')
        res.send(JSON.stringify(itemToDelete))
      })
    })
})
module.exports = router;
