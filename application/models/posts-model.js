const db = require("../database/database");

const PostModel = {};

PostModel.getNRecentPosts = (numberOfPost) => {
    let baseSQL = 'SELECT post_id, price, title, post_description, post_creation_time, post_thumbnail FROM posts, categories WHERE post_category=categories.category_id AND categories.category_name LIKE "%" ORDER BY post_creation_time DESC'
    return db.execute(baseSQL,[numberOfPost])
    .then(([results, fields]) => {
        return Promise.resolve(results);
    })
    .catch((err) => Promise.reject(err));
}


module.exports = PostModel;