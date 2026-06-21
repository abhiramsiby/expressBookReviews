const express = require('express');
let books = require("./booksdb.js");
let doesExits = require("./auth_users.js").doesExits;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios=require('axios');

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
  try{
    const fetchBooksAsync=()=>{
      return new Promise((resolve)=>{
        resolve(books);
      });
    };
    const bookDetails=await fetchBooksAsync();
    return res.status(200).json({message:"Available Books"+bookDetails});
  }
  catch(error){
    return res.status(500).json({message:"Erorr Fetching book-list"});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn=parseInt(req.params.isbn);
  try{
    const fetchBookByIsbn=(targetIsbn)=>{
      return new Promise((resolve,reject)=>{
        const book=books[targetIsbn];
        if(book){
          resolve(book);
        }
        else{
          reject(new Error("Book not found"));
        }
      });
    };
    const bookDetails=await fetchBookByIsbn(isbn);
    return res.status(300).json({message:"The book Details is\n" +booksDetails});
  }
  catch(error){
    return res.status(300).json({message: "No book found"});

  }
 });
  
// Get book details based on author
// Get book details based on Author using Async-Await and Promises
public_users.get('/author/:author', async function (req, res) {
  const authorName = req.params.author;

  try {
    // 1. Create a promise that simulates an async database query filter
    const fetchBooksByAuthor = (targetAuthor) => {
      return new Promise((resolve, reject) => {
        // Filter the books array matching the author's name (case-insensitive)
        const filteredBooks = Object.values(books).filter(book => 
          book.author.toLowerCase().includes(targetAuthor.toLowerCase())
        );

        if (filteredBooks.length > 0) {
          resolve(filteredBooks); // Pass matching books back on success
        } else {
          reject(new Error(`No books found written by author '${targetAuthor}'`)); // Fail state
        }
      });
    };

    // 2. Wait for the asynchronous filtering operation to complete
    const matchingBooks = await fetchBooksByAuthor(authorName);

    // 3. Return the array of books inside a clean JSON object
    return res.status(200).json({
      message: `Books by author '${authorName}' fetched successfully`,
      books: matchingBooks
    });

  } catch (error) {
    // 4. Catch the rejection if no matching books were found
    return res.status(404).json({ 
      message: error.message 
    });
  }
});

// Get all books based on title
// Get all books based on title using Async-Await and Promises
public_users.get('/title/:title', async function (req, res) {
  const titleName = req.params.title;

  try {
    // 1. Create a promise that simulates an async database title search
    const fetchBooksByTitle = (targetTitle) => {
      return new Promise((resolve, reject) => {
        // Filter books where the title contains the target string (case-insensitive)
        const filteredBooks = Object.values(books).filter(book => 
          book.title.toLowerCase().includes(targetTitle.toLowerCase())
        );

        if (filteredBooks.length > 0) {
          resolve(filteredBooks); // Resolve with matching books array
        } else {
          reject(new Error(`No books found with the title matching '${targetTitle}'`)); // Reject if empty
        }
      });
    };

    // 2. Await the promise resolution
    const matchingBooks = await fetchBooksByTitle(titleName);

    // 3. Return the results in clean JSON format
    return res.status(200).json({
      message: `Books with title matching '${titleName}' fetched successfully`,
      books: matchingBooks
    });

  } catch (error) {
    // 4. Catch the error if the promise was rejected
    return res.status(404).json({ 
      message: error.message 
    });
  }
});
//  Get book review
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

module.exports.general = public_users;
