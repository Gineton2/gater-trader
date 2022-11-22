/* 
    Filename: debugprinters.js

    Purpose: Formats errors with colors 

    Author: Duccio Rocca & Yoshimasa Iwano, Team: 07

    Course: CSC648 SFSU

 */

const colors = require('colors');

colors.setTheme({
    error: ['black', 'bgRed'],
    success: ['black', 'bgGreen'],
    request: ['black', 'bgWhite']
})

const printers = {
    errorPrint: (message) => {
        console.log(colors.error(message));
    },

    successPrint: (message) => {
        console.log(colors.success(message));
    },

    requestPrint: (message) => {
        console.log(colors.request(message));
    }
}

module.exports = printers;