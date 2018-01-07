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
    .innerJoin('users', 'user.id', 'products.seller_id')
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

router.post('/', function(req, res, next) {
  let newBookmark
  console.log('req.body in bookmarks/post ', req.body)
  const {userId, productId} = req.body
  //add error handling for missing fields
  const bookmark = {user_id: userId, product_id: productId}
  knex('bookmarks')
    .insert(bookmark)
    .returning('*')
    .first()
    .then( bm => {
      newBookmark = {id: bm.id, productId: bm.product_id}
      return knex('products')
        .select('*')
        .where('id', bm.product_id)
        .first()
        .then( product => {
          newBookmark.itemName = product.item_name
          newBookmark.sellerName = product.seller_name
          newBookmark.category = product.category
          newBookmark.price = product.price
          newBookmark.quantity = product.quantity
          newBookmark.image = product.image
          res.setHeader('Content-type', 'application/json')
          res.send(JSON.stringify(newBookmark))
        })
    })
})

router.delete('/:id', function(req, res, next) {
  console.log('bookmark to delete ', req.params.id)
  knex('bookmarks')
    .del()
    .where('id', req.params.id)
    .then( deleted => {
      res.setHeader('Content-type', 'application/json')
      res.send(JSON.stringify(deleted))
    })
})
module.exports = router;
