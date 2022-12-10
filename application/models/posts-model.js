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
    let baseSQL = 'SELECT post_id, price, title, post_description, post_creation_time, post_thumbnail, post_category, post_path FROM posts, categories WHERE post_category=categories.category_id AND categories.category_name LIKE "%" ORDER BY post_creation_time DESC'
    return db.execute(baseSQL)
    .then(([results, fields]) => {
        return Promise.resolve(results);
    })
    .catch((err) => Promise.reject(err));
}

PostModel.search = (searchTerm, category) =>{
    let baseSQL = "SELECT post_id, title, price, post_description, post_thumbnail, post_category, post_path, concat_ws(' ', title, post_description) AS haystack  FROM posts  JOIN categories on categories.category_id WHERE categories.category_id = post_category AND categories.category_name LIKE ? HAVING haystack LIKE ?"
    let sqlReadySearchTerm = "%"+searchTerm+"%";
    return db.execute(baseSQL, [category,sqlReadySearchTerm])
        .then(([results,fields]) => {
            return Promise.resolve(results);
        })
        .catch((err)=> Promise.reject(err));
}

PostModel.create = (title, post_description, post_path, post_thumbnail, author_id, price, category) => {
    console.log(title, post_description, post_path, post_thumbnail, author_id, price, category);
    let baseSQL = 'INSERT INTO posts (title, post_description, post_path, post_thumbnail, post_creation_time, author_id, price, post_category) VALUE (?,?,?,?,now(),?,?,?);';
    return db.execute(baseSQL,[title, post_description, post_path, post_thumbnail, author_id, price, category])
        .then(([results,fields])=>{
            return Promise.resolve(results && results.affectedRows);

        })
        .catch((err) => Promise.reject(err));
}

PostModel.determineCategory = (categoryName) =>{
    console.log(categoryName);

    let baseSQL = 'SELECT category_id FROM copy_EC2_DB.categories WHERE category_name=?';
    return db.execute(baseSQL,[categoryName])
        .then(([results,fields])=>{
            console.log(results[0]);
            return Promise.resolve(results[0].category_id);

        })
        .catch((err) => Promise.reject(err));
}

module.exports = PostModel;