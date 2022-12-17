/* 
    Filename: index.js

    Purpose: Creates Express application
    and render views of site. 

    Author: Duccio Rocca, Yoshimasa Iwano
    Gineton Alencar, Rai'd Muhammad, Eddie Fu,
    Dominque Henry, Kobe D Shelby, Team: 07

    Course: CSC648 SFSU

 */


var express = require('express');

//The top-level express object has a Router() method that creates a new router object.
var router = express.Router();

var db = require('../database/database');

const {getRecentPosts, getUserPosts, sortUserPostsByPriceASC, sortUserPostsByPriceDESC, sortUserPostsByDateASC, sortUserPostsByDateDESC}  = require('../middleware/postsMiddleware');
const {getUserMessages} = require('../middleware/messagesMiddleware.js');
// to deliver DCV file
path = require('path');

/*
The app.get() method specifies a callback function that will be invoked whenever there is an HTTP GET request with a path ('/') relative to the site root
 */
/* GET home page. */
router.get('/', getRecentPosts, function(req, res, next) {
    // console.log(res.locals.username);
    // console.log(res.locals.results);
    res.render('index');
});

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.get('/login', function(req,res,next) {
  res.render('login');
})

router.get('/about-team', function(req, res, next) {
  res.render('about-team');
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

router.get('/signup', function(req, res, next) {
  res.render('signup');

});

router.get('/message', function(req, res, next) {
  res.render('message');

});

router.get('/make-post', function(req, res, next) {
  res.render('make-post');

});

router.get('/dashboard', getUserPosts, getUserMessages, function(req, res, next) {
  res.render('dashboard');

});

router.get('/forgot-password', function(req, res, next) {
  res.render('forgot-password');

});

router.get('/sort-by-price-asc', sortUserPostsByPriceASC, getUserMessages,(req, res, next) => {
  res.render('dashboard');
})

router.get('/sort-by-price-desc', sortUserPostsByPriceDESC, getUserMessages, (req, res, next) => {
  res.render('dashboard');
})

router.get('/sort-by-date-asc', sortUserPostsByDateASC, getUserMessages, (req, res, next) => {
  res.render('dashboard');
})

router.get('/sort-by-date-desc', sortUserPostsByDateDESC, getUserMessages,(req, res, next) => {
  res.render('dashboard');
})
// router for SSL verification
router.get('/.well-known/pki-validation/C1F698E4294F748AAADBDBA09B48A4B3.txt', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../.well-known/pki-validation', 'C1F698E4294F748AAADBDBA09B48A4B3.txt'));
});


  /*
To make objects available outside of a module
you just need to expose them as additional properties on the exports object.
BUT
If you want to export a complete object in one assignment instead of building it one property at a time,
assign it to module.exports as shown below
 */
module.exports = router;
