const express = require('express');
let books = require("./booksdb.js");
let doesExits = require("./auth_users.js").doesExits;
let users = require("./auth_users.js").users;
const public_users = express.Router();
let users=[];

//Registering new User
public_users.post("/register", (req,res) => {
  //Write your code here
    const username=req.body.username;
    const password=req.body.password;
    if(username && password){
        if(!doesExits(username)){
            users.push({"username":username,"password":password});
            return res.status(300).json({message:`${username} successfully registered`})
        }
        else{
            return res.status(404).json({message:"User already exists Please login!!"});
        }
    }
    else{
        return res.status(404).json({message:"Unable to register user"});
    }

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  let booksDetails=JSON.stringify(books);
  return res.status(300).json({message: "Available Books are\n" +booksDetails});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn=parseInt(req.params.isbn);
  const book=books[isbn];
  if(book){
    booksDetails=JSON.stringify(book,null,4);
    return res.status(300).json({message:"The book Details is\n" +booksDetails});
  }
  else{
    return res.status(300).json({message: "No book found"});

  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const authorname=req.params.author;
  filteredBooks=Object.values(books).filter(book=>{
  return book.author.toLowerCase().includes(authorname.toLowerCase());  })
  if(filteredBooks.length>0){
    booksDetails=JSON.stringify(filteredBooks,null,4);
    return res.status(300).json({message:"books based on auhtor"+booksDetails});
  }
  else{
    return res.status(300).json({message:"No books found"});
  }
});

// Get all books based on title
public_users.get('/review/:isbn', function (req, res) {
  const isbn = parseInt(req.params.isbn);
  const book = books[isbn];

  if (book) {
    // Check if the actual object has any keys inside it
    if (Object.keys(book.reviews).length > 0) {
      const bookReview = JSON.stringify(book.reviews, null, 4);
      return res.status(300).json({ message: "Book review:\n" + bookReview });
    } else {
      // This will now execute perfectly when there are zero reviews!
      return res.status(300).json({ message: "No Reviews posted" });
    }
  } else {
    return res.status(300).json({ message: "Book Not available" });
  }
});
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
      const isbn=parseInt(req.params.isbn);
      const book=books[isbn];
      if(book){
        const bookReview=JSON.stringify(book.reviews,null,4);
        if(bookReview.length>0){
          return res.status(300).json({message:"Book review"+bookReview});
        }
        else{
          return res.status(300).json({message:"No Reviews post"});


        }
      }
      else{
        return res.status(300).json({message:"Book Not available"});
      }
      
});

module.exports.general = public_users;
