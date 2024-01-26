const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
   if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const loggedin_user = req.session.authorization.username;
    const newReview = req.body.review;

    //if the book review for an isbn has changed
    if(isbn && newReview) {
        books[isbn].reviews[loggedin_user] = newReview;
        return res.status(200).send("Review added/updated successfully for ISBN "+isbn+" for user "+loggedin_user);
    } else{
        return res.status(208).json({message: "Review updation failed. Provide proper isbn and review data."});
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const loggedin_user = req.session.authorization.username;

    //if the book review for an isbn has changed
    if(isbn && books[isbn].reviews[loggedin_user]) {
        delete books[isbn].reviews[loggedin_user];
        return res.status(200).send("Review deleted successfully for ISBN "+isbn+" for user "+loggedin_user);
    } else{
        return res.status(208).json({message: "Review deletion failed. Provide proper isbn data."});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
