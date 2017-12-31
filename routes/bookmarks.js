var express = require('express');
var router = express.Router();
var knex = require('../knex')


router.get('/', function(req, res, next) {
  return knex('bookmarks')
    .select('*')
    .then ( bookmarks => {
      res.setHeader('Content-type', 'application/json')
      res.send(JSON.stringify(bookmarks))
    })
});

router.get('/:id', function(req, res, next) {
  console.log('getting to route for bookmarks by user id, user id is ', req.params.id)
  return knex('bookmarks')
    .select('*')
    .where('user_id', req.params.id)
    .then( bookmarks => {
      // console.log('bookmarks ', bookmarks);
      if (!bookmarks[0]) {
        console.log('user has no bookmarks');
        res.setHeader("Content-Type", "application/json")
        res.send(JSON.stringify([]))
      } else {
      console.log('user has bookmarks ', bookmarks);
      res.setHeader("Content-Type", "application/json")
      res.send(JSON.stringify(bookmarks))
      }
    })
});

router.post('/', function(req, res, next) {
  console.log('req.body in bookmarks/post ', req.body)
  const {userId, itemId} = req.body
  //add error handling for missing fields
  const bookmark = {user_id: userId, item_id: itemId}
  knex('bookmarks')
    .insert(bookmark)
    .returning('*')
    .then( newBookmark => {
      res.setHeader('Content-type', 'application/json')
      res.send(JSON.stringify(newBookmark))
    })
})

router.delete('/:id', function(req, res, next) {
  console.log('bookmark to delete ', req.params.id)
  knex('bookmarks')
    .del()
    .where('id', req.params.id)
    .then( deleted => {
      res.redirect('/:id')
    })
}
module.exports = router;
