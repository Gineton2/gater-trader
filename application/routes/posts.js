/* 
    Filename: posts.js

    Purpose: Uses middleware to execute search
    and provide index layout of results.
    Also adds files to storage wth filename and mimetype.

    Author: Duccio Rocca, Yoshimasa Iwano, Team: 07

    Course: CSC648 SFSU 
*/

var express = require('express');
var db = require('../database/database');


var router = express.Router();

const {requestPrint, errorPrint, successPrint} = require('../helpers/debugprinters');
var sharp = require('sharp');
var multer = require('multer');
var crypto = require('crypto');


var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// var PostError = require('../helpers/error/PostError');
// const {postValidation} = require('../middleware/validation');

const {doTheSearch} = require('../middleware/postsMiddleware');

var PostModel = require("../models/posts-model");

var storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, "public/images/uploads");
    },
    filename: function(req, file,cb){
        let fileExt = file.mimetype.split('/')[1];
        let randomName = crypto.randomBytes(22).toString("hex");
        cb(null,`${randomName}.${fileExt}`);
    }
});

var uploader = multer({storage: storage});


router.post('/search', doTheSearch, function(req,res,next) {

    res.render('index');
    
});

     module.exports = router;