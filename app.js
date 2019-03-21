const express = require("express");
const pug = require("pug");
const bodyParser = require("body-parser");
const db = require("./config/database.js");
const app = express();
const Books = require("./models/Books");
const methodOverride = require("method-override");

app.use(bodyParser.urlencoded({ extended: false }));

//Test connection
db.authenticate()
  .then(() => console.log("Database connected..."))
  .catch(err => console.log("Error" + err));

app.set("view engine", "pug");

app.use(express.static("public"));

app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.redirect("/books");
});

app.get("/books", (req, res) =>
  Books.findAll()
    .then(books => {
      res.render("index", { books });
    })
    .catch(err => console.log(err))
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
    .then(book => res.redirect("/books"))
    .catch(err => console.log(err));
});

//update book form
app.get("/books/:id", (req, res) =>
  Books.findByPk(req.params.id)
    .then(books => {
      res.render("update-book", { books });
    })
    .catch(err => console.log(err))
);

//perform update
app.put("/books/:id", function(req, res, next) {
  Books.findByPk(req.params.id).then(function(books) {
    return books.update(req.body);
  });
  res.redirect("/books/");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
