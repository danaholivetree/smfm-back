var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function(req, res, next) {
  console.log('request body in users route', req.body);
  return knex('users')
    .where('fb_id', req.body.id)
    .first()
    .then( user => {
      console.log('user from query ', user);
      if (user) {
        knex('products')
          .select('*')
          .where('seller_id', user.id)
          .then( products => {
            res.send(products)
          })
      }
      knex('users')
        .insert({'fb_id': req.body.userID})
        .returning('*')
        .then( user => {
          res.send(user)
        })
    }).catch( err => err)

});

module.exports = router;
