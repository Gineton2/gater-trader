var express = require('express');

//The top-level express object has a Router() method that creates a new router object.
var router = express.Router();



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
  

  /*
To make objects available outside of a module
you just need to expose them as additional properties on the exports object.
BUT
If you want to export a complete object in one assignment instead of building it one property at a time,
assign it to module.exports as shown below
 */
  module.exports = router;