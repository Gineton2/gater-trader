/* 
    Filename: users.js

    Purpose: Creates application parser and 
    executes sql query to insert users and handles 
    errors for inserting in users. 

    Author: Duccio Rocca, Yoshimasa Iwano, Team: 07

    Course: CSC648 SFSU 
*/

var express = require('express');
const {requestPrint, errorPrint, successPrint} = require('../helpers/debugprinters');
var flash = require('express-flash');
const UserError = require("../helpers/error/UserError");
const UserModel = require('../models/users-model');
const {usernameValidation, passwordValidation, loginValidation, emailValidation} = require('../middleware/validation');

//The top-level express object has a Router() method that creates a new router object.
var router = express.Router();

router.use(express.urlencoded({extended: false}));

router.get('/', function(req, res, next) {
    res.render('index');
});


router.post('/register', usernameValidation, passwordValidation, emailValidation, (req, res, next) => {

    
    let password = req.body.password;
    let username = req.body.username;
    let email = req.body.email;
    let matchPassword = req.body.matchPassword;

    UserModel.usernameExists(username)
    .then((usernameDoesExits) => {
        if(usernameDoesExits){
            throw new UserError(
                "Registration failed: Username already exists",
                "/signup",
                200
            );
        }else{
            return UserModel.emailExists(email);
        }
    })
    .then((emailDoesExists) => {
        if(emailDoesExists){
            throw new UserError(
                "Registration failed: Email already exists",
                "/signup",
                200
            );
        }else{
            return UserModel.create(username, password, email);
        }
    })
    .then((createUserId)=>{
        if(createUserId < 0){
            throw new UserError(
                "Server Error: user could not be created",
                "/signup",
                500
            );
        }else{
            successPrint("User.js --> User was created");
            req.flash('success', 'User account has been created');
            res.redirect('/login');
        }
    })
    .catch((err) => {

        errorPrint("User could not be made", err);
        // req.flash('error', 'Error: user could not be created');
        req.session.save(err => {

            res.redirect("/signup");
        });

        if (err instanceof UserError) {
            errorPrint(err.getMessage());
            req.flash('error', err.getMessage());
            res.status(err.getStatus());
            res.redirect(err.getRedirectURL());
        } else {
            next(err);
        }})


    
  });

router.post('/login', (req, res, next) => {

    let email = req.body.email;
    let password = req.body.password;

    UserModel.authenticate(email,password)
        .then((userInfo) => {
            if (userInfo != -1) {

                successPrint(`User ${userInfo.username} is logged in`);

                req.session.username = userInfo.username;
                req.session.userId = userInfo.userId;

                res.locals.logged = true;
                res.locals.username = userInfo.username;
                res.locals.userId = userInfo.userId;
                
                console.log(res.locals);
                req.flash('success', 'Hi, You have successfully logged in');
                req.session.save(err => {res.redirect('/')});
                
            } else {
                throw new UserError("Invalid Email or Password", '/login', 200);
            }

        })
        .catch((err) => {
            errorPrint("user login failed")
            if (err instanceof UserError) {

                req.flash('error', err.getMessage());
                errorPrint(err.getMessage());
                res.status(err.getStatus());
                res.render('login');
                

            } else {
                res.render('login');
                
            }

        });


});

router.post('/logout', (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            errorPrint(err.getMessage());
            next(err);
        } else {
            
            successPrint('Session was destroyed');
            res.clearCookie('csID');
            req.session = null;
            res.locals.logged = false;
            res.json({status: "Ok", message: "user is logged out"});
            
        }

    });

});


module.exports = router;