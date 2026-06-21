const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const doesExits=(username)=>{
    let userswithsamename=users.filter((user)=>{
        return user.username==username;
    });
    if(userswithsamename.length>0){
        return true;
    }
    else{
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
      const username=req.body.username;
      const password=req.body.password;
      if(!username || !password){
          return res.status(404).json({message:"Error Logging in"});
      }
      if(authenticatedUser(username,password)){
          let accessToken=jwt.sign({
              username:username
  
          },'access',{expiresIn:60*60});
          req.session.authtorization={
              accessToken,username
          }
          return res.status(200).json("User successfully logged in");
      }
      else{
          return res.status(208).json({message:"Invalid Login"});
      }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn=parseInt(req.params.isbn);
  const reviewText=req.query.review;
  const username=req.user?.username;
  if(!username){
    return res.status(403).json({message:"User not logged in or authorized"});

  }
  if(!reviewText){
    return res.status(400).json({message:"Review teext is required"});
  }
  const book=books[isbn];
  if(book){
    book.reviews[username]=reviewText;
    return res.status(200).json({message: `Review for ISBN ${isbn} by user '${username}' has been successfully added/updated.`});

  }
  else{
    return res.status(404).json({ message: "Book not found with this ISBN" });
  }

});

//Deleting a review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = parseInt(req.params.isbn);
    
    // Extract the logged-in username from the session
    const username = req.user?.username; 

    // 1. Safety Check: Ensure the user is actually authenticated
    if (!username) {
        return res.status(403).json({ message: "User not logged in or authorized" });
    }

    const book = books[isbn];

    // 2. Check if the book exists
    if (book) {
        // 3. Check if this specific user has actually left a review for this book
        if (book.reviews && book.reviews[username]) {
            
            // Delete only this user's review key from the reviews object
            delete book.reviews[username];

            return res.status(200).json({
                message: `Review for ISBN ${isbn} by user '${username}' has been deleted successfully.`,
                reviews: book.reviews
            });
        } else {
            return res.status(404).json({ message: `No review found for user '${username}' under this book.` });
        }
    } else {
        return res.status(404).json({ message: "Book not found with this ISBN" });
    }
});


module.exports.authenticated = regd_users;
module.exports.doesExits = doesExits;
module.exports.users = users;
