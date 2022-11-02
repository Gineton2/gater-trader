const mysql = require('mysql2');

const db = mysql.createPool({
    // EC2
    // host: "localhost",
    // database:"db_test",
    // user: "root", 
    // password: "TEAM07team07",

    // local
    host: 'localhost',
    user : 'root',
    database : 'copy_EC2_DB',
    password : 'ABB10iote'
});

module.exports = db.promise();