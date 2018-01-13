var express = require('express');
var router = express.Router();
const knex = require('../knex')

/* GET users listing. */
router.get('/', function(req, res, next) {
  return knex('users')
    .select('*')
    .then( allUsers => {
      res.setHeader('content-type', 'application/json')
      res.send(JSON.stringify(allUsers))
    })
})

//search products by user id
router.get('/:id', function(req, res, next) {
  console.log('getting users products for sale and whether seller')
  return knex('products')
    .select('products.id as id', 'seller_id as sellerId' ,'item_name as itemName', 'description', 'category', 'price', 'quantity', 'name as sellerName', 'image_url as image', 'thumbnail_url as thumbnail', 'sold', 'purchaser_id')
    .where('seller_id', req.params.id)
    .innerJoin('users', 'users.id', 'products.seller_id')
    .then( products => {
      console.log(products);
      if (!products[0]) {
        res.setHeader("Content-Type", "application/json")
        res.setHeader('Set-Cookie', [`smfmId=${req.params.id}`]);
        const headerNames = res.getHeaders()
        console.log('headerNames ', headerNames);
        res.send(JSON.stringify({id: req.params.id, products: []}))// need to fix this
      } else {
          console.log('getting users products for sale ', products);
          let sendInfo = {products, id: req.params.id} ///isseller:true was here
          res.setHeader("Content-Type", "application/json")
          // res.setHeader('Set-Cookie', [`smfmId=${req.params.id}`]);
          // const headerNames = res.getHeaders()
          // console.log('headerNames ', headerNames)
          
          res.send(JSON.stringify(sendInfo))
        }
    })
})

router.post('/', function(req, res, next) {
  console.log('req.body in users/post ', req.body);
  if (!req.body.id) {
    return next(new Error('must have fb id in request'))
  }
  let id = +req.body.id
  return knex('users')
    .select('*')
    .where('fb_id', req.body.id)
    .first()
    .then( exists => {
      console.log('user from query ', exists);
      if (!exists) {
          console.log('user was not in db, inserting ');
        return knex('users')
          .insert({'fb_id': req.body.id, 'name': req.body.name, is_seller: false})
          .returning('*')
          .then( newUser => {
            console.log('user returned from insert ', newUser[0]);
            res.setHeader("Content-Type", "application/json")
            res.setHeader('Set-Cookie', [`smfmId=${newUser[0].id}`]);
            res.send(JSON.stringify({id: newUser[0].id, isSeller: false}))
          })
      }
      console.log('user was in db');
      res.redirect(`/users/${exists.id}`)
    }).catch( err => next(err))

});

module.exports = router;
