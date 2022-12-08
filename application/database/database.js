/* 
    Filename: Database.js
    
    Purpose: Establishes MySQL connection

    Author: Duccio Rocca & Yoshimasa Iwano 

    Team: 07

    Course: CSC648 SFSU

 */

// const { Template } = require('@carbon/icons-react');
const mysql = require('mysql2');
// const { title } = require('process');

//Comment out code that doesn't reflect local connection
const db = mysql.createPool({
    
    // EC2
    // host: "localhost",
    // database:"db_test",
    // user: "root", 
    // password: "TEAM07team07",

    // local Duccio
    host: 'localhost',
    user : 'root',
    database : 'copy_EC2_DB',
    password : 'ABB10iote'

    // // local Yoshi
    // host: 'localhost',
    // user : 'root',
    // database : 'copy_EC2_DB',
    // password : 'passyoshi'

     // // local Rai'd M.
    host: 'localhost',
    user : 'root',
    database : 'teamschema',
    password : 'nap765gUp!'
});

module.exports = db.promise();