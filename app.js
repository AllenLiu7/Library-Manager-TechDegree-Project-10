const express = require("express");
const pug = require("pug");
const bodyParser = require("body-parser");
const db = require("./config/database.js");
const app = express();
const Books = require("./models/Books");

app.use(bodyParser.urlencoded({ extended: false }));

//Test connection
db.authenticate()
  .then(() => console.log("Database connected..."))
  .catch(err => console.log("Error" + err));

app.set("view engine", "pug");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect("/books");
});

app.get("/books", (req, res) =>
  Books.findAll()
    .then(books => {
      res.render("index", { books });
    })
    .catch(err => res.render("error"))
);

app.get("/books/new", (req, res) => res.render("new-book"));

//add a book
app.post("/books/new", (req, res) => {
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
        : res.send(err)
    );
  // .catch(err => res.render("error"));
});

//update book form
app.get("/books/:id", (req, res) =>
  Books.findByPk(req.params.id)
    .then(books =>
      books
        ? res.render("update-book", { books })
        : res.render("page-not-found")
    )
    .catch(err => res.render("error"))
);

//perform update
app.post("/books/:id", (req, res) =>
  Books.findByPk(req.params.id)
    .then(books =>
      books ? books.update(req.body) : res.render("page-not-found")
    )
    .then(() => res.redirect("/books"))
    .catch(err => res.render("error"))
);

//Delete Books
app.post("/books/:id/delete", (req, res) =>
  Books.findByPk(req.params.id)
    .then(books => (books ? books.destroy() : res.render("page-not-found")))
    .then(() => res.redirect("/books"))
    .catch(err => res.render("error"))
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
