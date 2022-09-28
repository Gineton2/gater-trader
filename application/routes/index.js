var express = require('express');

//The top-level express object has a Router() method that creates a new router object.
var router = express.Router();

var db = require('../database/database');

router.post('/register', (req, res, next) => {

  let password = req.body.password;
  let username = req.body.username;
  let Email = req.body.Email;

  let sqlCommand = "INSERT INTO table1 (username, email, password) VALUES (?,?,?)";
  return db.execute(sqlCommand, [username, Email, password]);
  
});


/*
The app.get() method specifies a callback function that will be invoked whenever there is an HTTP GET request with a path ('/') relative to the site root
 */
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/aboutMe', function(req, res, next) {
    res.render('aboutMe');
    
});

router.get('/about-gineton', function(req, res, next) {
  res.render('about-gineton');
});

router.get('/about-yoshimasa-iwano', function(req, res, next) {
  res.render('about-yoshimasa-iwano');
});

router.get('/about-duccio', function(req, res, next) {
  res.render('about-duccio');
  
});

router.get('/about-eddie-fu', function(req, res, next) {
  res.render('about-eddie-fu');
  
});

router.get('/about-raid', function(req, res, next) {
  res.render('about-raid');
  
});

router.get('/about-kobe', function(req, res, next) {
  res.render('about-kobe');
  
});

router.get('/about-dominique', function(req, res, next) {
  res.render('about-dominique');

});

router.get('/database-test', function(req, res, next) {
  res.render('database-test');

});




  

  /*
To make objects available outside of a module
you just need to expose them as additional properties on the exports object.
BUT
If you want to export a complete object in one assignment instead of building it one property at a time,
assign it to module.exports as shown below
 */
  module.exports = router;