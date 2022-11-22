
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

module.exports = UserModel;