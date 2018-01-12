var express = require('express')
var router = express.Router()
var request = require('request')
var clientSecret = process.env.CLIENT_SECRET
//var knex = require('../knex')

/* GET auth page. */
router.get('/', function(req, res, next) {
  console.log('req.query' , req.query)
  console.log('req.query.code ', req.query.code);
  request(`https://connect.stripe.com/oauth/token?client_secret=${clientSecret}&code=${req.query.code}&grant_type=authorization_code`,
     { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    let userInfo = res.json()
    const {access_token, stripe_user_id} = userInfo
  //   {
  //   "access_token": "{ACCESS_TOKEN}",
  //   "livemode": false,
  //   "refresh_token": "{REFRESH_TOKEN}",
  //   "token_type": "bearer",
  //   "stripe_publishable_key": "{PUBLISHABLE_KEY}",
  //   "stripe_user_id": "{ACCOUNT_ID}",
  //   "scope": "express"
  // }
    console.log('access_token ', access_token);
    console.log('stripe_user_id ', stripe_user_id);


  })
})

module.exports = router;
