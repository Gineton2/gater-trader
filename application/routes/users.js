var express = require('express');
//The top-level express object has a Router() method that creates a new router object.
var router = express.Router();

var db = require('../database/database');

router.get('/users', function(req, res, next) {
    res.render('index');
});

router.post('/register', (req, res, next) => {

    res.send("YAY");
  
    let password = req.body.password;
    let username = req.body.username;
    let Email = req.body.Email;
  
    let sqlCommand = "INSERT INTO table1 (username, email, password) VALUES (?,?,?)";
    return db.execute(sqlCommand, [username, Email, password]);
    
  });



  module.exports = router;