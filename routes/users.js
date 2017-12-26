var express = require('express');
var router = express.Router();
const knex = require('../knex')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function(req, res, next) {
  if (!req.body.id) {
    return next(new Error('must have fb id in request'))
  }
  let id = +req.body.id
  console.log('id numberified ', id);
  return knex('users')
    .select('*')
    .where('fb_id', req.body.id)
    .first()
    .then( exists => {
      console.log('user from query ', exists);
      if (!exists) {
          console.log('user was not in db, inserting ');
        return knex('users')
          .insert({'fb_id': req.body.id})
          .returning('*')
          .finally( newUser => {
            console.log('user returned from insert ', user);
            res.setHeader("Content-Type", "application/json")
            res.send(user)
          })
      }
      console.log('user was in db');
      return knex('products')
        .select('*')
        .where('seller_id', user.id)
        .then( products => {
          if(!products) {
            res.setHeader("Content-Type", "application/json")
            res.send({})
          }
          res.setHeader("Content-Type", "application/json")
          res.send(products)
        })


    }).catch( err => next(err))

});

module.exports = router;
