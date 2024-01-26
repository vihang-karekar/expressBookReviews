const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!doesExist(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
});

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

// Get the book list available in the shop
public_users.get('/',function (req, res) {
     //Creating a promise. 
     let myPromise = new Promise((resolve,reject) => {
        resolve(books);
    })
    myPromise.then((successMessage) => {
        res.send(JSON.stringify(successMessage,null,4));
      })
    //res.send(JSON.stringify(books,null,4)); 
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    //Creating a promise. 
    let myPromise = new Promise((resolve,reject) => {
        resolve(books[isbn]);
    })
    myPromise.then((successMessage) => {
        res.send(JSON.stringify(successMessage,null,4));
      })
    //res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author_param = req.params.author;
    const filtered_books = [];

    const booksKeys = Object.keys(books);
    //Creating a promise. 
    let myPromise = new Promise((resolve,reject) => {
        for (let i = 0; i < booksKeys.length; i++) {
            if (books[booksKeys[i]].author === author_param){
                filtered_books.push(books[booksKeys[i]]);
            }
          }
        resolve(filtered_books);
    })
    myPromise.then((successMessage) => {
        res.send(JSON.stringify(successMessage,null,4));
      })
    /*for (let i = 0; i < booksKeys.length; i++) {
        if (books[booksKeys[i]].author === author_param){
            filtered_books.push(books[booksKeys[i]]);
        }
      }
    return res.send(filtered_books);*/
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title_param = req.params.title;
    const filtered_books = [];

    const booksKeys = Object.keys(books);

    //Creating a promise. 
    let myPromise = new Promise((resolve,reject) => {
        for (let i = 0; i < booksKeys.length; i++) {
            if (books[booksKeys[i]].title === title_param){
                filtered_books.push(books[booksKeys[i]]);
            }
          }
        resolve(filtered_books);
    })
    myPromise.then((successMessage) => {
        res.send(JSON.stringify(successMessage,null,4));
      })
    /*for (let i = 0; i < booksKeys.length; i++) {
        if (books[booksKeys[i]].title === title_param){
            filtered_books.push(books[booksKeys[i]]);
        }
      }
    return res.send(filtered_books);*/
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews)
});

module.exports.general = public_users;
