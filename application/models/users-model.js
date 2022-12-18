/* 
    Filename: users-model.js

    Purpose: handles interaction with database: create users and queries to select data 

    Author: Duccio Rocca & Yoshimasa Iwano, Team: 07

    Course: CSC648 SFSU

 */


const UserModel = {};
var bcrypt = require('bcrypt');
var db = require('../database/database');

UserModel.create = (username, password, email) => {
    return bcrypt.hash(password,15)
        .then((hashedPassword) => {
            let sqlCommand = "INSERT INTO users (username, email, password, creation_time) VALUES (?,?,?,now())";
            return db.execute(sqlCommand, [username, email, hashedPassword]);
    })
        .then(([results,fields])=> {
            if(results && results.affectedRows){
                console.log("INSERTID: "+results.insertId)
                return Promise.resolve(results.insertId);
            }else{
                return Promise.resolve(-1);
            }
        })
        .catch((err)=> Promise.reject(err));
};


UserModel.usernameExists = (username) => {
    return db.execute("SELECT * FROM users WHERE username=?",
        [username])
        .then(([results,fields]) => {
             return Promise.resolve(!(results && results.length==0));
        })
        .catch((err) => Promise.reject(err));
};

UserModel.emailExists = (email) =>{
    return db.execute("SELECT * FROM users WHERE email=?",
        [email])
        .then(([results,fields]) => {
            return Promise.resolve(!(results && results.length==0));
        })
        .catch((err) => Promise.reject(err));
}

UserModel.authenticate = (email, password) =>{

    // let userId, username;
    let userInfo = {};
    let baseSQL = "SELECT * FROM users WHERE email=?;";

    

    return db.execute(baseSQL, [email])
        .then(([results,fields]) => {
            console.log("results:"+results[0].user_id);
            if(results && results.length==1){
                userInfo.userId = results[0].user_id;
                userInfo.username = results[0].username;
                console.log("user exists: "+userInfo.userId +" "+ userInfo.username );
                let compare = bcrypt.compare(password, results[0].password);
                return compare;

            }else{
                return Promise.resolve(-1);
            }
        })
        .then((passwordMatch) => {
            console.log("password check");
            if(passwordMatch){
                return Promise.resolve(userInfo);
            }else{
                return Promise.resolve(-1);
            }
        })
        .catch((err)=> {
            console.log("failed no results from db");
            return Promise.resolve(-1)});
}

UserModel.sendMessage = (author_id, post_id, message_text) =>{
    return db.execute("SELECT u.user_id FROM users u JOIN posts p ON p.author_id = u.user_id WHERE p.post_id = ?",[post_id])
        
            .then(([results,fields]) => {
                console.log("RESULTS: "+results);
                let receiver_id = results[0].user_id;
                console.log("RECEIVER ID: "+receiver_id);
                console.log("AUTHOR MESSAGE: "+author_id);

                let baseSQL = 'INSERT INTO messages (post_id, author_id, receiver_id, message_text, creation_time) VALUE (?,?,?,?,now());';
                return db.execute(baseSQL,[post_id, author_id, receiver_id, message_text])
                    
            }).then(([results,fields])=>{
                console.log("RESULTS before resolve: "+results);
                return Promise.resolve(results && results.affectedRows);
        })
        .catch((err) => Promise.reject(err));
}

module.exports = UserModel;