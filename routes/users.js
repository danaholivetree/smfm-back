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
  return knex('products')
    .select('products.id as id', 'seller_id as sellerId' ,'item_name as itemName', 'description', 'category', 'price', 'quantity', 'name as sellerName', 'image_url', 'sold', 'purchaser_id')
    .where('seller_id', req.params.id)
    .innerJoin('users', 'users.id', 'products.seller_id')
    .then( products => {
      if (!products[0]) {
        res.setHeader("Content-Type", "application/json")
        res.send(JSON.stringify({id: req.params.id, products: []}))// need to fix this
      } else {
        let sendInfo = {products, id: req.params.id}
        res.setHeader("Content-Type", "application/json")
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
          .insert({'fb_id': req.body.id, 'name': req.body.name})
          .returning('*')
          .then( newUser => {
            console.log('user returned from insert ', newUser);
            res.setHeader("Content-Type", "application/json")
            res.send(JSON.stringify({user: newUser}))
          })
      }
      console.log('user was in db');
      res.redirect(`/users/${exists.id}`)
    }).catch( err => next(err))

});

module.exports = router;
