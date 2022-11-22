var express = require('express');
const {requestPrint, errorPrint, successPrint} = require('../helpers/debugprinters');
var flash = require('express-flash');
const UserError = require("../helpers/error/UserError");
const UserModel = require('../models/users-model');
const {usernameValidation, passwordValidation, loginValidation} = require('../middleware/validation');

//The top-level express object has a Router() method that creates a new router object.
var router = express.Router();
var bodyParser = require('body-parser');
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/', function(req, res, next) {
    res.render('index');
});

router.post('/register',urlencodedParser, usernameValidation, passwordValidation, (req, res, next) => {

    
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
    // let sqlCommand = "INSERT INTO users (username, email, password, creation_time) VALUES (?,?,?, now())";
    
    // db.execute(sqlCommand, [username, email, password])
    // .then(()=>{
    //     res.send("Data sent to database");
        
    // })
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



  module.exports = router;