var express = require('express');
var router = express.Router();
var knex = require('../knex')

/* GET all products */
router.get('/', function(req, res, next) {
  return knex('products')
    .select('products.id as id', 'seller_id as sellerId' , 'users.fb_id as sellerFb', 'item_name as itemName', 'description', 'short', 'category', 'price', 'quantity', 'name as sellerName', 'image_url as image', 'thumbnail_url as thumbnail', 'sold', 'purchaser_id as purchaserId')
    .innerJoin('users', 'users.id', 'products.seller_id')
    .then ( products => {
      console.log('got all products ', products);
      res.setHeader('Content-type', 'application/json')
      res.send(JSON.stringify(products))
    })
});

//post new product
router.post('/', function(req, res, next) {
  const {sellerId, itemName, quantity, price, short, description, category, image, thumbnail} = req.body
  //add error handling for missing fields
  const addThisProduct = {seller_id: sellerId, item_name: itemName, quantity, price, short, description, category}
  if (image && thumbnail) {
     addThisProduct.image_url = image
     addThisProduct.thumbnail_url = thumbnail
  }
  // let newItem
  return knex('users')
    .where('id', sellerId)
    .update('is_seller', true)
    .returning('*')
    .then ( stuff => {
      return knex('products')
        .insert(addThisProduct, '*')
        .then( newProduct => {
          knex('products')
            .where('products.id', newProduct[0].id)
            .select('products.id', 'seller_id as sellerId', 'users.fb_id as sellerFb', 'item_name as itemName', 'description', 'short', 'category', 'price', 'quantity', 'image_url as image', 'sold', 'thumbnail_url as thumbnail', 'purchaser_id as purchaserId')
            .innerJoin('users', 'seller_id', 'users.id')
            .select('name as sellerName')
            .first()
            .then( readyToSend => {
              res.setHeader('Content-type', 'application/json')
              res.send(JSON.stringify(readyToSend))
            })
        })
    })
})

//edit a product
router.put('/:id', function(req, res, next) {
  const {itemName, category, description, price, short, quantity, image, thumbnail, sellerFb} = req.body
  var product = {}
  if (itemName) {
    product.item_name = itemName
  }
  if (category) {
    product.category = category
  }
  if (short) {
    product.short = short
  }
  if (description) {
    product.description = description
  }
  if (price) {
    product.price = price
  }
  if (quantity) {
    product.quantity = quantity
  }
  if (image) {
    product.image_url = imageUrl
  }
  if (thumbnail) {
    product.thumbnail_url = thumbnailUrl
  }

  return knex('products')
    .update(product, '*')
    .where('id', req.params.id)
    .then( product => {
      const {id, seller_id, item_name, category, price, quantity, description, short, image_url, thumbnail_url, sold, purchaser_id} = product[0]
      const editedProduct = {
        id,
        sellerId: seller_id,
        sellerFb: sellerFb,
        itemName: item_name,
        category, price, quantity, description, short,
        image: image_url,
        thumbnail: thumbnail_url,
        sold,
        purchaserId: purchaser_id
      }
      res.setHeader("Content-Type", "application/json")
      res.send(JSON.stringify(editedProduct))
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
          res.setHeader("Content-Type", "application/json")
          res.send(JSON.stringify(itemToDelete))
        })
    })
})

module.exports = router;
