var express = require('express');
var router = express.Router();
var knex = require('../knex')


router.get('/', function(req, res, next) {
  return knex('bookmarks')
    .select('*')
    .then ( bookmarks => {
      res.setHeader('Content-type', 'application/json')
      res.send(JSON.stringify(bookmarks))
    })
});

router.get('/:id', function(req, res, next) {
  console.log('getting to route for bookmarks by user id, user id is ', req.params.id)
  return knex('bookmarks')
    .select('bookmarks.id as id','products.id as productId', 'seller_id as sellerId' ,'item_name as itemName', 'description', 'category', 'price', 'quantity', 'name as sellerName', 'image_url', 'sold', 'purchaser_id')
    .where('user_id', req.params.id)
    .innerJoin('products', 'bookmarks.product_id', 'products.id')
    .innerJoin('users', 'users.id', 'products.seller_id')
    .then( bookmarks => {
      if (!bookmarks[0]) {
        res.setHeader("Content-Type", "application/json")
        res.send(JSON.stringify([]))
      } else {
        res.setHeader("Content-Type", "application/json")
        res.send(JSON.stringify(bookmarks))
      }
    })
});

// router.post('/', function(req, res, next) {
//   const {productId, userId} = req.body
//   const bookmark = {user_id: userId, product_id: productId}
//   console.log(bookmark);
//   return knex('bookmarks')
//     .insert(bookmark, '*')
//     .select('bookmarks.id as id')
//     .innerJoin('products', 'bookmarks.product_id', 'products.id')
//     .select(['products.id as productId', 'seller_id as sellerId', 'item_name as itemName', 'description', 'category', 'price', 'quantity',  'image_url as image', 'sold', 'purchaser_id as purchasedBy'])
//     .innerJoin('users', 'users.id', 'products.seller_id')
//     .select('users.name as sellerName')
//     .then( newBookmark => {
//       console.log('new bookmark info from db ', newBookmark[0]);
//       res.setHeader('Content-type', 'application/json')
//       res.send(JSON.stringify(newBookmark[0]))
//     })
// })

router.post('/', function(req, res, next) {
  const {productId, userId} = req.body
  const bookmark = {user_id: userId, product_id: productId}
  console.log(bookmark);
  return knex('bookmarks')
    .insert(bookmark, '*')
    .first()
    .then( newBookmark => {
      return knex('bookmarks')
        .where('bookmarks.id', newBookmark.id)
        .select('bookmarks.id as id')
        .innerJoin('products', 'bookmarks.product_id', 'products.id')
        .select(['products.id as productId', 'seller_id as sellerId', 'item_name as itemName', 'description', 'category', 'price', 'quantity',  'image_url as image', 'sold', 'purchaser_id as purchasedBy'])
        .innerJoin('users', 'users.id', 'products.seller_id')
        .select('users.name as sellerName')
        .then( newBookmark => {
          console.log('new bookmark info from db ', newBookmark[0]);
          res.setHeader('Content-type', 'application/json')
          res.send(JSON.stringify(newBookmark[0]))
      })
    })
})

router.delete('/:id', function(req, res, next) {
  let itemToDelete
  console.log('bookmark to delete ', req.params.id)
  return knex('bookmarks')
    .where('id', req.params.id)
    .select()
    .first()
    .then( forDelete => {
      itemToDelete = forDelete
      knex('bookmarks')
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
