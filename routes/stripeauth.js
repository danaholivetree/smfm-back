var express = require('express')
var router = express.Router()
var request = require('request')
var clientSecret = process.env.CLIENT_SECRET
var knex = require('../knex')

/* GET auth page. */
router.get('/', function(req, res, next) {

  // request.get(`https://connect.stripe.com/express/oauth/authorize?redirect_uri=http://localhost:3000/stripeauth&client_id=ca_C7RrShVaSZvRq3WYFZ8Z2JS7yc3LriK5&state=obfuscation12345`)
  console.log('req.cookies  in stripe auth ', req.cookies);
  if (req.query.state==='obfuscation12345'){
  request.post(`https://connect.stripe.com/oauth/token?client_secret=${clientSecret}&code=${req.query.code}&grant_type=authorization_code`,
     { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    const {access_token, stripe_user_id, stripe_publishable_key} = body
    const stripeUser = {access_token, stripe_user_id, stripe_publishable_key, is_seller:true}
    return knex('users')
      .where('id', 5) ///AHHHHHHHHH
      .update(stripeUser, '*')
      .then( userInfo => {
        // res.redirect(`/users/${req.cookies.smfmId}`)
      })
    }) //close post
  }//close if
})



module.exports = router;
