var express = require('express');

//The top-level express object has a Router() method that creates a new router object.
var router = express.Router();


/*
The app.get() method specifies a callback function that will be invoked whenever there is an HTTP GET request with a path ('/') relative to the site root
 */
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('../views/index.html');
  });