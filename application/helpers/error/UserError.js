/* 
    Filename: UserError.js

    Purpose: handles user errors: returns error msg, redirectUrl and status

    Author: Duccio Rocca & Yoshimasa Iwano, Team: 07

    Course: CSC648 SFSU

 */

class UserError extends Error {
    constructor(message, redirectURL, status){
        super(message);
        this.redirectURL = redirectURL;
        this.status = status;
    }

    getMessage() {
        return this.message;
    }

    getRedirectURL() {
        return this.redirectURL;
    }

    getStatus() {
        return this.status;
    }
}

module.exports = UserError;