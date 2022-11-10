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


// good working one

router.post('/search',urlencodedParser, doTheSearch, function(req,res,next) {

    console.log(req.params.results);

    res.render('index');
    
});

/*

router.get('/search', async (req,res,next) =>{

    try{
     
     let searchTerm = req.query.search;
     listTerms = searchTerm.split('-');
     searchTerm = listTerms[0];
     let categorySearch = listTerms[1];
     
     if(categorySearch==='All'){
        categorySearch = "%";
     }
  
     if(!searchTerm){ // empty input

        // when input is empty show all content within the category 
        let results = await PostModel.search(searchTerm, categorySearch);
             if (results.length) {
                 res.send({
                     message: `No input was given for your search, but here are ${results.length} posts that may interest you`,
                     results: results
                    })
                }else{// nothing within the category so let's show all the posts
                    let [results,fields] = await db.query('SELECT post_id, price, title, post_description, post_creation_time, post_thumbnail FROM posts, categories WHERE post_category=categories.category_id AND categories.category_name LIKE "%" ORDER BY post_creation_time DESC');
                    res.send({
                        message: `No result whithin the selected category, but here are ${results.length} posts that may interest you`,
                        results: results
                       });
                 }
                
     }else { // input text is not empty so show result of the query
         let results = await PostModel.search(searchTerm, categorySearch);
             if (results.length) {
                 res.send({
                     message: `${results.length} results found`,
                     results: results
                 });
             } else { // nothing found therefore let's show all the posts within the selected category
                 let [results,fields] = await db.query('SELECT post_id, price, title, post_description, post_creation_time, post_thumbnail FROM posts, categories WHERE post_category=categories.category_id AND categories.category_name LIKE ? ORDER BY post_creation_time DESC', [categorySearch]);
                            if(results.length){

                                if(categorySearch==='%'){
                                categorySearch='all categories';
                                }
                                
                            res.send({
                             results: results,
                            //  message: `No results were found for your search but here are ${results.length} posts`
                            
                             message: `No results were found for ${searchTerm} but here are ${results.length} posts within ${categorySearch}`
                         }); }
                         else{// nothing within the category so let's show all the posts
                            let [results,fields] = await db.query('SELECT post_id, price, title, post_description, post_creation_time, post_thumbnail FROM posts, categories WHERE post_category=categories.category_id AND categories.category_name LIKE "%" ORDER BY post_creation_time DESC');
                            res.send({
                                message: `No result whithin the selected category, but here are ${results.length} posts that may interest you`,
                                results: results
                               });
                         }
                     }
             }
         } catch(err){
        next(err);
        }
     });

*/

     module.exports = router;