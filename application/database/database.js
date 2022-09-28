const mysql = require('mysql2');

const db = mysql.createPool({
    host: "localhost",
    database:"db_test",
    user: "root", 
    password: "TEAM07team07", 
});

module.exports = db.promise();