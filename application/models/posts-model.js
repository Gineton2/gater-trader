/* 
    Filename: posts-model.js
    
    Purpose: Execute the select query in the database 
    to get 'n' amount of recent posts 

    Author: Duccio Rocca & Yoshimasa Iwano, Team: 07
    
    Course: CSC648 SFSU

 */


const db = require("../database/database");

const PostModel = {};

PostModel.getALLRecentPosts = () => {
    let baseSQL = 'SELECT post_id, price, title, post_description, post_creation_time, post_thumbnail FROM posts, categories WHERE post_category=categories.category_id AND categories.category_name LIKE "%" ORDER BY post_creation_time DESC'
    return db.execute(baseSQL)
    .then(([results, fields]) => {
        return Promise.resolve(results);
    })
    .catch((err) => Promise.reject(err));
}

PostModel.search = (searchTerm, category) =>{
    // let baseSQL = "SELECT post_id, title, post_description, post_thumbnail, post_category, concat_ws(' ', title, post_description) AS haystack FROM posts, categories HAVING haystack like ?;"
    let baseSQL = "SELECT post_id, title, price, post_description, post_thumbnail, post_category, concat_ws(' ', title, post_description) AS haystack  FROM posts  JOIN categories on categories.category_id WHERE categories.category_id = post_category AND categories.category_name LIKE ? HAVING haystack LIKE ?"
    let sqlReadySearchTerm = "%"+searchTerm+"%";
    return db.execute(baseSQL, [category,sqlReadySearchTerm])
        .then(([results,fields]) => {
            return Promise.resolve(results);
        })
        .catch((err)=> Promise.reject(err));
}

module.exports = PostModel;