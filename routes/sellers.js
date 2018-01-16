var express = require('express');
var router = express.Router();
var knex = require('../knex')



router.get('/:id', function(req, res, next) {
  console.log('in get seller by id route; id is ', req.params.id);
  return knex('sellers')
    .where('id', req.params.id)
    .select('sk')
})

router.post('/', (req, res, next) => {
  console.log(req.body);
  return knex('users')
    .select('id')
    .whereIn('fb_id', req.body)
    .then( ids => {
      console.log('ids of friends ', ids)
      let idsArr = ids.map( id => {
        return id.id
      })
      console.log('idsArr ', idsArr);
      return knex('products')
        .whereIn('seller_id', idsArr)
        .where('sold', false)
        .select('products.id as id', 'seller_id as sellerId', 'users.fb_id as sellerFb','item_name as itemName', 'short', 'description', 'category', 'price', 'quantity', 'name as sellerName', 'image_url as image', 'thumbnail_url as thumbnail', 'sold', 'purchaser_id as purchaserId')
        .innerJoin('users', 'users.id', 'products.seller_id')
        .then( friendsProducts => {
          res.setHeader('content-type', 'application/json')
          res.send(friendsProducts)
        })
    })

})

module.exports = router;
