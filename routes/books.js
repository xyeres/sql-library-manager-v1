const express = require('express');
const router = express.Router();
const Book = require('../models').Book;


/* Handler function to wrap each route. */
function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next)
        } catch (error) {
            // Forward error to the global error handler
            next(error);
        }
    }
}

// Show full list of books
router.get('/', asyncHandler(async (req, res, next) => {
    console.log('...starting');

    let books = await Book.findAll();
    books = books.map(book => book.toJSON())

    console.log('got books');

    res.json(books);

    console.log('done with get handler');
}));

// Shows the create new book form
router.get('/new', (req, res, next) => {
    const ctx = {

    }
    res.render('new', ctx)
});

// Posts a new book to the database
router.post('/new', (req, res, next) => {
    
});


// Shows book detail form
router.get('/:id', (req, res, next) => {

});

// Updates book info in the database
router.post('/:id', (req, res, next) => {

});

// Delets book
router.post('/:id/delete', (req, res, next) => {

});

module.exports = router;