/* 
    Filename: messages-model.js
    
    Purpose: Execute the select query in the database 
    to get 'user's posts

    Author: Yoshimasa Iwano, Team: 07
    
    Course: CSC648 SFSU

 */


const db = require("../database/database");

const MessageModel = {};

MessageModel.getUserMessageById = (userId) => {
    let baseSQL = 
        `SELECT u.user_id, u.username, m.message_id, m.post_id, m.author_id, m.receiver_id, a.username AS author, r.username AS receiver, m.message_text, date_format(m.creation_time, '%M-%D-%Y %T') as date
        FROM users u
        JOIN messages m
        ON u.user_id=m.receiver_id OR u.user_id=m.author_id
        JOIN users a
        ON a.user_id=m.author_id
        JOIN users r
        ON r.user_id=m.receiver_id
        WHERE u.user_id=?
        ORDER BY date DESC;`
    return db.execute(baseSQL, [userId])
        .then(([results, fields]) => {
            // console.log(results);
            return Promise.resolve(results);
        })
        .catch(err => Promise.reject(err));
}


module.exports = MessageModel;
