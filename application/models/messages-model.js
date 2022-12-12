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
            `SELECT u.user_id, u.username, m.message_id, m.post_id, m.author_id, m.receiver_id, m.message_text, date_format(m.creation_time, '%M-%D-%Y %T') as date
            FROM users u
            JOIN messages m
            ON u.user_id=m.receiver_id OR u.user_id=m.author_id
            WHERE u.user_id=?;`
        return db.execute(baseSQL, [userId])
            .then(([results, fields]) => {
                console.log(results);
                return Promise.resolve(results);
            })
            .catch(err => Promise.reject(err));
    }
