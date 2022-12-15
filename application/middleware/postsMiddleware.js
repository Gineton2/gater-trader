/* 
    Filename: postsMiddlewars.js
    
    Purpose: establishes logic in regard to posting
    and searching the site

    Author: Duccio Rocca & Yoshimasa Iwano, Team: 07
    
    Course: CSC648 SFSU

 */


const postsMiddleware = {};

var db = require("../database/database");
const PostError = require("../helpers/error/PostError");

// var bodyParser = require("body-parser");

const { search, getALLRecentPosts, getPostById, sendMessage, getUserPostById, sortByPriceASC, sortByPriceDESC, sortByDateASC, sortByDateDESC } = require("../models/posts-model");

const doTheSearch = async function (req, res, next) {

  try {
    let searchTerm = req.body.searchText;
    let categorySearch = req.body.selectedCat;

    let inputChecker = /^[_A-z0-9]{1,40}$/;
    if(!inputChecker.test(searchTerm)){
      searchTerm = "";
    }

    if (categorySearch === "All") {
      categorySearch = "%";
    }

    if (searchTerm === "") {
      // empty input

      // when input is empty show all content within the category
      let results = await search(searchTerm, categorySearch);
      if (results.length) {
        if (categorySearch === "%") {
          categorySearch = "All";
        }
        res.locals.results = results;
        res.locals.message = `Here are ${results.length} posts that may interest you`;
        res.locals.condition = `${categorySearch} > ${searchTerm}`;
        res.locals.imageFalse = "False";
        res.locals.categorySearch = categorySearch;
        res.locals.searchTerm = searchTerm;

        next();
      } else {
        // nothing within the category so let's show all the posts
        if (categorySearch === "%") {
          categorySearch = "All";
        }
        let [results, fields] = await db.query(
          'SELECT post_id, price, title, post_description, post_creation_time, post_thumbnail, post_category, post_path, approved, active FROM posts, categories WHERE post_category=categories.category_id AND categories.category_name LIKE "%" AND approved=1 AND active=1 ORDER BY post_creation_time DESC'
        );
       

        res.locals.results = results;
        res.locals.message = `No results whithin the selected category, but here are ${results.length} posts that may interest you`,
        res.locals.condition = `${categorySearch} > ${searchTerm}`;
        res.locals.imageFalse = "False";
        res.locals.categorySearch = categorySearch;
        res.locals.searchTerm = searchTerm;

        next();
      }
    } else {
      // input text is not empty so show result of the query
      let results = await search(searchTerm, categorySearch);
      if (results.length) {
        if (categorySearch === "%") {
          categorySearch = "All";
        }

        res.locals.results = results;
        res.locals.message = `${results.length} results found`;
        res.locals.condition = `${categorySearch} > ${searchTerm}`;
        res.locals.imageFalse = "False";
        res.locals.categorySearch = categorySearch;
        res.locals.searchTerm = searchTerm;
        next();

      } else {
        // nothing found therefore let's show all the posts within the selected category
        let [results, fields] = await db.query(
          "SELECT post_id, price, title, post_description, post_creation_time, post_thumbnail, post_category, post_path, approved, active FROM posts, categories WHERE post_category=categories.category_id AND categories.category_name LIKE ? AND approved=1 AND active=1 ORDER BY post_creation_time DESC",
          [categorySearch]
        );
        if (results.length) {
          if (categorySearch === "%") {
            categorySearch = "All";
          }

          res.locals.results = results;
          if (categorySearch === "All") {
            res.locals.message = `No results were found for ${searchTerm} but here are ${results.length} posts within all categories`;
          } else {
            res.locals.message = `No results were found for ${searchTerm} but here are ${results.length} posts within ${categorySearch}`;
          }

          res.locals.condition = `${categorySearch} > ${searchTerm}`;
          res.locals.imageFalse = "False";
          res.locals.categorySearch = categorySearch;
          res.locals.searchTerm = searchTerm;

          next();
        } else {
          // nothing within the category so let's show all the posts
          let [results, fields] = await db.query(
            'SELECT post_id, price, title, post_description, post_creation_time, post_thumbnail, post_category, post_path, approved, active FROM posts, categories WHERE post_category=categories.category_id AND categories.category_name LIKE "%" AND approved=1 AND active=1 ORDER BY post_creation_time DESC'
          );

          if (categorySearch === "%") {
            categorySearch = "All";
          }

          res.locals.results = results;
          res.locals.message = `No result whithin the selected category, but here are ${results.length} posts that may interest you`;
          res.locals.condition = `${categorySearch} > ${searchTerm}`;
          res.locals.imageFalse = "False";
          res.locals.categorySearch = categorySearch;
          res.locals.searchTerm = searchTerm;

          next();
        }
      }
    }
  } catch (err) {
    next(err);
  }
};

const findReceiver = async function(req, res, next) {
  try {

    let post_id = req.body.post_id;
    let author_id = req.body.author_id;
    console.log("AUTHOR MESSAGE: "+author_id);
    let message_text = req.body.message;
    console.log("POST ID: "+post_id);
    let [results, fields] = await db.query(
      'SELECT u.user_id FROM users u JOIN posts p ON p.author_id = u.user_id WHERE p.post_id = ? ',[post_id]
    );
    console.log("RESULTS: "+results);
    let receiver_id = results[0].user_id;
    console.log("RECEIVER ID: "+receiver_id);
    console.log("AUTHOR MESSAGE: "+author_id);

    let success = await sendMessage(post_id, author_id, receiver_id, message_text);
    if(success==-1){
      throw new PostError;
    }else{
      req.flash("success", "Your message was sent successfully!");
    }

    next();

  } catch (err) {
    next(err);
  }
}

const getRecentPosts = async function(req,res,next) {

  try {

      let results = await getALLRecentPosts();
      res.locals.results = results;
      if(results.length == 0) {
          req.flash('error', 'There are no posts created yet');
      }
      next();

  } catch(err) {
      next(err);
  }
}

const getTargetPostById = async function(req, res, next) {
  try {
    let postId = req.params.id;
    let results = await getPostById(postId);
    if (results && results.length) {
      res.locals.currentPost = results[0];
      next();
    }
    else {
      req.flash('error', 'There are not posts you are looking for.');
      res.redirect('/');
    }
  } catch (err) {
    next(err);
  }
}

const getUserPosts = async function(req, res, next) {
  try {
    const userId = res.locals.userId;
    // console.log(res.locals);
    let results = await getUserPostById(userId);
    if (results && results.length) {
      res.locals.userPost = results;
      next();
    }
    else {
      req.flash('error', 'There is not an user you are looking for.');
      res.redirect('/');
    }
  } catch (err) {
    next(err);
  }
}

const sortUserPostsByPriceASC = async function(req, res, next) {
  try {
    const userId = res.locals.userId;
    let results = await sortByPriceASC(userId);
    if (results && results.length) {
      res.locals.userPost = results;
      next();
    }
    else {
      req.flash('error', 'There are no posts yet.');
      res.redirect('/dashboard');
    }
  } catch (err) {
    next(err);
  }
}

const sortUserPostsByPriceDESC = async function(req, res, next) {
  try {
    const userId = res.locals.userId;
    let results = await sortByPriceDESC(userId);
    if (results && results.length) {
      res.locals.userPost = results;
      next();
    }
    else {
      req.flash('error', 'There are no posts yet.');
      res.redirect('/dashboard');
    }
  } catch (err) {
    next(err);
  }
}

const sortUserPostsByDateASC = async function(req, res, next) {
  try {
    const userId = res.locals.userId;
    let results = await sortByDateASC(userId);
    if (results && results.length) {
      res.locals.userPost = results;
      next();
    }
    else {
      req.flash('error', 'There are no posts yet.');
      res.redirect('/dashboard');
    }
  } catch (err) {
    next(err);
  }
}

const sortUserPostsByDateDESC = async function(req, res, next) {
  try {
    const userId = res.locals.userId;
    let results = await sortByDateDESC(userId);
    if (results && results.length) {
      res.locals.userPost = results;
      next();
    }
    else {
      req.flash('error', 'There are no posts yet.');
      res.redirect('/dashboard');
    }
  } catch (err) {
    next(err);
  }
}

module.exports = { doTheSearch, getRecentPosts, getTargetPostById, findReceiver, getUserPosts, sortUserPostsByPriceASC, sortUserPostsByPriceDESC, sortUserPostsByDateASC, sortUserPostsByDateDESC };
