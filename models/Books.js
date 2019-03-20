const Sequelize = require("sequelize");
const db = require("../config/database.js");

const Books = db.define("books", {
  title: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: {
        msg: "Title is required!"
      }
    }
  },
  author: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: {
        msg: "Author is required!"
      }
    }
  },
  genre: {
    type: Sequelize.STRING
  },
  year: {
    type: Sequelize.INTEGER
  }
});

module.exports = Books;
