/* 
    Filename: postsMiddlewars.js
    
    Purpose: establishes logic in regard to messages

    Author: Yoshimasa Iwano, Team: 07
    
    Course: CSC648 SFSU

 */



var db = require("../database/database");
const { getUserMessageById } = require("../models/messages-model");

const getUserMessages = async function(req, res, next) {
    try {
      const userId = res.locals.userId;
      // console.log(res.locals);
      const results = await getUserMessageById(userId);
      res.locals.userMessage = results;
      next();
    } catch (err) {
      next(err);
    }
  }

module.exports = { getUserMessages };
