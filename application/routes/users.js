var express = require('express');
const {requestPrint, errorPrint, successPrint} = require('../helpers/debugprinters');
var flash = require('express-flash');
const UserError = require("../helpers/error/UserError");

//The top-level express object has a Router() method that creates a new router object.
var router = express.Router();
var bodyParser = require('body-parser');

var db = require('../database/database');


// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/', function(req, res, next) {
    res.render('index');
});

router.post('/register',urlencodedParser, (req, res, next) => {

    
    console.log(req.body);
    console.log(req.body.password);
    console.log(req.body.username);

    
    let password = req.body.password;
    let username = req.body.username;
    let email = req.body.email;

  
    let sqlCommand = "INSERT INTO table1 (username, email, password) VALUES (?,?,?)";
    
    db.execute(sqlCommand, [username, email, password])
    .then(()=>{
        res.send("Data sent to database");
    })
    .catch((err) => {
        errorPrint("User could not be made", err);
    
        req.flash('error', 'Error: user could not be created');
        req.session.save(err => {
    
            res.redirect("/database-test");
        });
    
        
            errorPrint(err.getMessage());
            req.flash('error', err.getMessage());
            res.status(err.getStatus());
            res.redirect(err.getRedirectURL());
        
        
    
    })


    
  });



  module.exports = router;