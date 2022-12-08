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
const fs = require('fs-extra')



var router = express.Router();


var sharp = require('sharp');
var multer = require('multer');
var crypto = require('crypto');

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const {requestPrint, errorPrint, successPrint} = require('../helpers/debugprinters');
var PostError = require('../helpers/error/PostError');
const {postValidation} = require('../middleware/validation');
const {doTheSearch} = require('../middleware/postsMiddleware');
var PostModel = require("../models/posts-model");

var storage = multer.diskStorage({

    destination: function (req, file, cb){

        let { category } = req.body;

        if(category==1){
            category="Videos";
        }
        if(category==2){
            category="Music";
        }
        if(category==3){
            category="Ebooks";
        }
        if(category==4){
            category="Slides";
        }
        if(category==5){
            category="Images";
        }

        cb(null, `public/uploads/${category}`);
    },
    filename: function(req, file, cb){
        let fileExt = file.mimetype.split('/')[1];
        let randomName = crypto.randomBytes(22).toString("hex");
        cb(null,`${randomName}.${fileExt}`);
    }
});

var uploader = multer({storage: storage});


router.post('/search', doTheSearch, function(req,res,next) {

    res.render('index');
    
});

router.post('/createPost', uploader.single("upload"), postValidation, (req,res,next) =>{

    let fileUploaded = req.file.path;
    
    let fileAsThumbNail = `thumbnail-${req.file.filename}`;
    let destinationOfThumbnail = req.file.destination + "/" + fileAsThumbNail;
    let title = req.body.PostTitle;
    let description = req.body.PostDescription;
    let fk_userId = req.session.userId;
    let category = req.body.category;
    let price = req.body.price;

    


    if(category == 1){ //VIDEOS
          
        const p1 =   new Promise ((resolve,reject)=>{
            // fs.copy(fileUploaded, destinationOfThumbnail, err => {
            //     if (err) return console.error(err)
            //     console.log('success video uploaded!');
            //   });
            destinationOfThumbnail = "../"+fileUploaded;
            resolve(PostModel.create(title,description,fileUploaded,destinationOfThumbnail,fk_userId, price, category));
        })
        .then((postWasCreated)=>{
            if(postWasCreated){
                req.flash('success', "Your Post was created successfully!");
                res.redirect('/');
            }else{
                throw new PostError('Post could not be created!!', '/post', 200);
            }
        })
        .catch((err) =>{
            if(err instanceof PostError){
                errorPrint(err.getMessage());
                req.flash('error', err.getMessage());
                res.status(err.getStatus());
                res.redirect(err.getRedirectURL());
            }else{
                next(err);
            }

        })
    
    }else if(category == 2){ //IMAGES

        const p1 =   new Promise ((resolve,reject)=>{

             

            destinationOfThumbnail = "../public/images/audio_image.jpg";
            resolve(PostModel.create(title,description,fileUploaded,destinationOfThumbnail,fk_userId, price, category));
        })
        .then((postWasCreated)=>{
            if(postWasCreated){
                req.flash('success', "Your Post was created successfully!");
                res.redirect('/');
            }else{
                throw new PostError('Post could not be created!!', '/post', 200);
            }
        })
        .catch((err) =>{
            if(err instanceof PostError){
                errorPrint(err.getMessage());
                req.flash('error', err.getMessage());
                res.status(err.getStatus());
                res.redirect(err.getRedirectURL());
            }else{
                next(err);
            }

        })
        
    }else if(category == 5){  //IMAGES

        sharp(fileUploaded)
        .resize(200)
        .toFile(destinationOfThumbnail)
        .then(()=>{
            destinationOfThumbnail = "../"+destinationOfThumbnail;
            return PostModel.create(title,description,fileUploaded,destinationOfThumbnail,fk_userId, price, category);
        })
        .then((postWasCreated)=>{
            if(postWasCreated){
                req.flash('success', "Your Post was created successfully!");
                res.redirect('/');
            }else{
                throw new PostError('Post could not be created!!', '/post', 200);
            }
        })
        .catch((err) =>{
            if(err instanceof PostError){
                errorPrint(err.getMessage());
                req.flash('error', err.getMessage());
                res.status(err.getStatus());
                res.redirect(err.getRedirectURL());
            }else{
                next(err);
            }

        })
        
    }else if(category == 3){ //Ebooks

        const p1 =   new Promise ((resolve,reject)=>{

             

            destinationOfThumbnail = "../public/images/icons/eBook1.jpeg";
            resolve(PostModel.create(title,description,fileUploaded,destinationOfThumbnail,fk_userId, price, category));
        })
        .then((postWasCreated)=>{
            if(postWasCreated){
                req.flash('success', "Your Post was created successfully!");
                res.redirect('/');
            }else{
                throw new PostError('Post could not be created!!', '/post', 200);
            }
        })
        .catch((err) =>{
            if(err instanceof PostError){
                errorPrint(err.getMessage());
                req.flash('error', err.getMessage());
                res.status(err.getStatus());
                res.redirect(err.getRedirectURL());
            }else{
                next(err);
            }

        })
        
    }else if(category == 4){ //Slides

        const p1 =   new Promise ((resolve,reject)=>{

             

            destinationOfThumbnail = "../public/images/icons/course.jpeg";
            resolve(PostModel.create(title,description,fileUploaded,destinationOfThumbnail,fk_userId, price, category));
        })
        .then((postWasCreated)=>{
            if(postWasCreated){
                req.flash('success', "Your Post was created successfully!");
                res.redirect('/');
            }else{
                throw new PostError('Post could not be created!!', '/post', 200);
            }
        })
        .catch((err) =>{
            if(err instanceof PostError){
                errorPrint(err.getMessage());
                req.flash('error', err.getMessage());
                res.status(err.getStatus());
                res.redirect(err.getRedirectURL());
            }else{
                next(err);
            }

        })
        
    }

    

   

});

     module.exports = router;