const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { authenticated } = require('./router/auth_users.js');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
let users=[];
const doesExit=(username)=>{
    let userswithsamename=users.filter((user)=>{
        return user.username==username;
    });
    if(userwithsamename.length>0){
        return true;
    }
    else{
        return false;
    }
}
const authenticatedUser = (username, password) => {
    // Filter the users array for any user with the same username and password
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
const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))
//Register new user
app.post("/register",(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    if(username && password){
        if(!doesExit(username)){
            user.push({"username":username,"password":passwors});
        }
        else{
            return res.status(404).json({message:"User already exists Please login!!"});
        }
    }
    else{
        return res.status(404).json({message:"Unable to register user"});
    }

});
//Login endpoint
app.post("/login",(req,res)=>{
    const uusername=req.body.username;
    const password=req.body.password;
    if(!username || !password){
        return res.status(404).json({message:"Error Logging in"});
    }
    if(authenticatedUser(username,password)){
        let accessToken=jwt.sign({
            data:password

        },'access',{expiresIn:60*60});
        req.session.authtorization={
            accesToken,username
        }
        return res.statues(200).send("User successfully logged in");
    }
    else{
        return res.status(208).json({message:"Invalid Login"});
    }

});
//Authentication
app.use("/customer/auth/*", function auth(req,res,next){
    if(req.session.authtorization){
        let token=req.session.authtorization['accessTokes'];
        jwt.verify(token,"access",(err,user)=>{
            if(!err){
                req.user=user;
                next();
            }
            else{
                return res.status(403).json({message:"User not authenticated"});
            }
        });
    }
    else{
        returnres.status(403).json({message:"User not logged in"});
    }

//Write the authenication mechanism here
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
