var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('...starting')
  let handleAsync = async (req, res, next) => {
    let books = await Book.findAll();
    books = books.map(book => book.toJSON())
    console.log('got books')
    res.json(books);
  }
  handleAsync(req, res, next);
  console.log('done with get handler')
});

module.exports = router;
