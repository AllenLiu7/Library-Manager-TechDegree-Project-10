const express = require("express");
const pug = require("pug");
const bodyParser = require("body-parser");
const db = require("./config/database.js");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

//Test connection
db.authenticate()
  .then(() => console.log("Database connected..."))
  .catch(err => console.log("Error" + err));

app.set("view engine", "pug");

const routes = require("./routes");

app.use(routes);

app.use(express.static("public"));

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  res.render("page-not-found");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
