var express = require('express');
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

    res.send("YAY");
    console.log(req.body);
    // console.log(req.body.password);
    // console.log(req.body.username);

  
    let password = req.body.password;
    let username = req.body.username;
    let email = req.body.email;
  
    let sqlCommand = "INSERT INTO table1 (username, email, password) VALUES (?,?,?)";
    return db.execute(sqlCommand, [username, email, password]);
    
  });



  module.exports = router;