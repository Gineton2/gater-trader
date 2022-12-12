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

PostModel.getPostById = (postId) => {
    let baseSQL = 
        `SELECT u.user_id, u.username, p.post_id, p.title, p.price, p.post_description, p.post_thumbnail, p.post_category, p.post_path
        FROM posts p
        JOIN users u
        ON p.author_id=u.user_id
        WHERE p.post_id=?;`
    return db.execute(baseSQL, [postId])
        .then(([results, fields]) => {
            return Promise.resolve(results);
        })
        .catch(err => Promise.reject(err));
}

PostModel.getUserPostById = (userId) => {
    let baseSQL = 
        `SELECT u.user_id, u.username, p.post_id, p.title, p.price, p.post_description, p.approved, p.active, date_format(p.post_creation_time, '%M-%D-%Y %T') as date
        FROM users u
        JOIN posts p
        ON u.user_id=p.author_id
        WHERE u.user_id=? AND p.active=1;`
    return db.execute(baseSQL, [userId])
        .then(([results, fields]) => {
            // console.log(results);
            return Promise.resolve(results);
        })
        .catch(err => Promise.reject(err));
}

PostModel.sortByPriceASC = (userId) => {
    let baseSQL = 
        `SELECT u.user_id, u.username, p.post_id, p.title, p.price, p.post_description, p.approved, p.active, date_format(p.post_creation_time, '%M-%D-%Y %T') as date
        FROM users u
        JOIN posts p
        ON u.user_id=p.author_id
        WHERE u.user_id=? AND p.active=1
        ORDER BY p.price ASC;`
    return db.execute(baseSQL, [userId])
        .then(([results, fields]) => {
            // console.log(results);
            return Promise.resolve(results);
        })
        .catch(err => Promise.reject(err));
}

PostModel.sortByPriceDESC = (userId) => {
    let baseSQL = 
        `SELECT u.user_id, u.username, p.post_id, p.title, p.price, p.post_description, p.approved, p.active, date_format(p.post_creation_time, '%M-%D-%Y %T') as date
        FROM users u
        JOIN posts p
        ON u.user_id=p.author_id
        WHERE u.user_id=? AND p.active=1
        ORDER BY p.price DESC;`
    return db.execute(baseSQL, [userId])
        .then(([results, fields]) => {
            // console.log(results);
            return Promise.resolve(results);
        })
        .catch(err => Promise.reject(err));
}

PostModel.sortByDateASC = (userId) => {
    let baseSQL = 
        `SELECT u.user_id, u.username, p.post_id, p.title, p.price, p.post_description, p.approved, p.active, date_format(p.post_creation_time, '%M-%D-%Y %T') as date
        FROM users u
        JOIN posts p
        ON u.user_id=p.author_id
        WHERE u.user_id=? AND p.active=1
        ORDER BY date ASC;`
    return db.execute(baseSQL, [userId])
        .then(([results, fields]) => {
            // console.log(results);
            return Promise.resolve(results);
        })
        .catch(err => Promise.reject(err));
}

PostModel.sortByDateDESC = (userId) => {
    let baseSQL = 
        `SELECT u.user_id, u.username, p.post_id, p.title, p.price, p.post_description, p.approved, p.active, date_format(p.post_creation_time, '%M-%D-%Y %T') as date
        FROM users u
        JOIN posts p
        ON u.user_id=p.author_id
        WHERE u.user_id=? AND p.active=1
        ORDER BY date DESC;`
    return db.execute(baseSQL, [userId])
        .then(([results, fields]) => {
            // console.log(results);
            return Promise.resolve(results);
        })
        .catch(err => Promise.reject(err));
}

module.exports = PostModel;