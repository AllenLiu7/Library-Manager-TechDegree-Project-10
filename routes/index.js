const express = require("express");
const router = express.Router();
const Books = require("../models/Books");

router.get("/", (req, res) => {
  res.redirect("/books");
});

router.get("/books", (req, res) =>
  Books.findAll()
    .then(books => {
      res.render("index", { books });
    })
    .catch(err => res.render("error"))
);

router.get("/books/new", (req, res) => res.render("new-book"));

//add a book
router.post("/books/new", (req, res) => {
  let { title, author, genre, year } = req.body;
  Books.create({
    title,
    author,
    genre,
    year
  })
    .then(() => res.redirect("/books"))
    .catch(err =>
      err.name === "SequelizeValidationError"
        ? res.render("new-book-error", { errors: err.errors })
        : res.render("error")
    );
});

//update book form
router.get("/books/:id", (req, res) =>
  Books.findByPk(req.params.id)
    .then(books =>
      books ? res.render("update-book", { books }) : res.render("error")
    )
    .catch(err => res.render("error"))
);

//perform update
router.post("/books/:id", (req, res) =>
  Books.findByPk(req.params.id)
    .then(books => (books ? books.update(req.body) : res.render("error")))
    .then(() => res.redirect("/books"))
    .catch(err => res.render("error"))
);

//Delete Books
router.post("/books/:id/delete", (req, res) =>
  Books.findByPk(req.params.id)
    .then(books => (books ? books.destroy() : res.render("error")))
    .then(() => res.redirect("/books"))
    .catch(err => res.render("error"))
);

module.exports = router;
