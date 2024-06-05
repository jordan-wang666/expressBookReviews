const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  // return res.status(200).json(books);
  const promiseBook = new Promise((resolve, reject) => {
    resolve(books);
  }, 1000);
  promiseBook
    .then((books) => {
      res.json(books);
    })
    .catch((err) => {
      res.status(404).json({ error: "Error occur!" });
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  // if (books[req.params.isbn]) {
  //   return res.status(200).json(books[req.params.isbn]);
  // }
  // return res
  //   .status(404)
  //   .json({ message: "Cannot find the book witch ISBN is " + req.params.isbn });
  const getBookByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject("Cannot find the book with ISBN " + isbn);
      }
    });
  };
  getBookByISBN(req.params.isbn)
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((err) => {
      res.status(404).json({
        message: "Cannot find the book witch ISBN is " + req.params.isbn,
      });
    });
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  //Write your code here
  // if (Object.values(books).some((book) => book.author === req.params.author)) {
  //   return res
  //     .status(200)
  //     .json(
  //       Object.values(books).find((book) => book.author === req.params.author)
  //     );
  // }
  // return res.status(404).json({
  //   message: "Cannot find the book witch author is " + req.params.author,
  // });

  const getBookByAuthor = (author) => {
    return new Promise((resolve, reject) => {
      const flag = Object.values(books).some((book) => book.author === author);
      if (flag) {
        resolve(Object.values(books).find((book) => book.author === author));
      } else {
        reject("Cannot find the book with author " + author);
      }
    });
  };

  try {
    const book = await getBookByAuthor(req.params.author);
    res.status(200).json(book);
  } catch (err) {
    res.status(404).json({
      message: "Cannot find the book witch author is " + req.params.author,
    });
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  //Write your code here
  // if (Object.values(books).some((book) => book.title === req.params.title)) {
  //   return res
  //     .status(200)
  //     .json(
  //       Object.values(books).find((book) => book.title === req.params.title)
  //     );
  // }
  // return res.status(404).json({
  //   message: "Cannot find the book witch title is " + req.params.title,
  // });
  const getBookByTitle = (title) => {
    return new Promise((resolve, reject) => {
      const flag = Object.values(books).some((book) => book.title === title);
      if (flag) {
        resolve(Object.values(books).find((book) => book.title === title));
      } else {
        reject("Cannot find the book with title " + title);
      }
    });
  };

  try {
    const book = await getBookByTitle(req.params.title);
    res.status(200).json(book);
  } catch (err) {
    res.status(404).json({
      message: "Cannot find the book witch title is " + req.params.title,
    });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  if (books[req.params.isbn]) {
    return res.status(200).json(books[req.params.isbn].reviews);
  }
  return res
    .status(404)
    .json({ message: "Cannot find the book witch ISBN is " + req.params.isbn });
});

module.exports.general = public_users;
