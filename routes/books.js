const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
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

// handle search
router.get('/search', asyncHandler(async (req, res, next) => {
    const query = req.query.q;
    const books = await Book.findAndCountAll({
        // Perform WHERE filtering on query
        where: {
            [Op.or]: [
                {
                    title: {
                        [Op.substring]: query
                    }
                },
                {
                    author: {
                        [Op.substring]: query
                    }
                },
                {
                    genre: {
                        [Op.substring]: query
                    }
                },
                {
                    year: {
                        [Op.eq]: query
                    }
                },
            ]

        }
    });
    const ctx = {
        title: "Search results",
        books: books.rows,
        count: books.count
    }
    res.render('books/index', ctx);
}));

// Show full list of books
router.get('/', asyncHandler(async (req, res, next) => {
    const perPage = 5;
    const page = req.query.page || 0;

    const books = await Book.findAndCountAll({
        limit: perPage,
        offset: perPage * page
    });

    const count = books.count;

    const ctx = {
        title: "All Books",
        books: books.rows,
        count,
        pages: Math.ceil(count / perPage)
    }
    res.render('books/index', ctx)

}));

// Shows the create new book form
router.get('/new', (req, res, next) => {
    const ctx = { title: "Create new book" }
    res.render('books/new-book', ctx)
});

// Posts a new book to the database
router.post('/new', asyncHandler(async (req, res, next) => {
    let book;
    try {
        book = await Book.create(req.body);
        res.redirect('/books/' + book.id);
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            book = await Book.build(req.body);
            const ctx = {
                title: "New book form error",
                book,
                errors: error.errors
            }
            res.render('books/new-book', ctx)
        } else {
            throw error;
        }
    }
}));


// Shows book detail form
router.get('/:id', asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    const ctx = {
        title: "Book details",
        book
    }
    res.render('books/update-book', ctx)
}));

// Updates book info in the database
router.post('/:id', asyncHandler(async (req, res, next) => {
    try {
        let book = await Book.findByPk(req.params.id);

        if (book) {
            await book.update(req.body);
            res.redirect('/books/' + book.id);
        }
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            book = await Book.build(req.body);
            book.id = req.params.id; // make sure we're updating the intended book
            const ctx = {
                title: "Book details",
                book,
                errors: error.errors
            }
            res.render('books/update-book', ctx)
        } else {
            throw error;
        }
    }
}));

// Deletes book
router.post('/:id/delete', asyncHandler(async (req, res, next) => {
    let book = await Book.findByPk(req.params.id);

    if (book) {
        await book.destroy();
        res.redirect('/books');
    } else {
        res.sendStatus(404);
    }
}));

module.exports = router;