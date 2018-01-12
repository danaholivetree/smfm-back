var express = require('express')
var router = express.Router()
var request = require('request')
var clientSecret = process.env.CLIENT_SECRET
var knex = require('../knex')

/* GET auth page. */
router.get('/:id', function(req, res, next) {

  if (req.query.state==='obfuscation12345'){
  request.post(`https://connect.stripe.com/oauth/token?client_secret=${clientSecret}&code=${req.query.code}&grant_type=authorization_code`,
     { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    console.log('body ', body);
    const {access_token, stripe_user_id, stripe_publishable_key} = body
    const stripeUser = {access_token, stripe_user_id, stripe_publishable_key, isSeller:true}
    return knex('users')
      .where('id', req.params.id)
      .update(stripeUser, '*')
      .then( userInfo[0] => {
        res.redirect('/')
      })
    }) //close post
  }//close if
})



module.exports = router;
