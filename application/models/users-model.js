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

module.exports = UserModel;