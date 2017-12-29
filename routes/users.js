var express = require('express');
var router = express.Router();
const knex = require('../knex')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

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
            res.send(JSON.stringify(newUser))
          })
      }
      let user = exists
      console.log('user was in db');
      res.redirect(`/products/${user.id}`)
      // return knex('products')
      //   .select('*')
      //   .where('seller_id', user.id)
      //   .then( products => {
      //     console.log('products ', products);
      //     if (!products[0]) {
      //       console.log('user has no products for sale');
      //       res.setHeader("Content-Type", "application/json")
      //       res.send(JSON.stringify({seller_id: user.id}))
      //     } else {
      //     console.log('user has products for sale ', products);
      //     res.setHeader("Content-Type", "application/json")
      //     res.send(JSON.stringify(products))
      //     }
      //   })


    }).catch( err => next(err))

});

module.exports = router;
