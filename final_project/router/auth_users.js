const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  return users.filter((user) => user.username === username).length > 0;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  if (!req.query.review) {
    return res.status(204).json({ message: "Please enter review information" });
  }
  if (!books[req.params.isbn]) {
    return res.status(404).json({
      message: "Cannot find the book witch ISBN is " + req.params.isbn,
    });
  }
  books[req.params.isbn].reviews[req.session.authorization.username] =
    req.query.review;
  return res.status(200).json({
    message:
      "The review for the book with ISBN " +
      req.params.isbn +
      " has been added/updated.",
  });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  if (!books[req.params.isbn]) {
    return res.status(404).json({
      message: "Cannot find the book witch ISBN is " + req.params.isbn,
    });
  }
  delete books[req.params.isbn].reviews[req.session.authorization.username];
  return res.status(200).json({
    message:
      "Reviews for the ISBN " +
      req.params.isbn +
      " posted by the user " +
      req.session.authorization.username +
      " deleted.",
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
