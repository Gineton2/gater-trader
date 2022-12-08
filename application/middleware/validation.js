/* 
    Filename: validation.js

    Purpose: handles user signup validation 

    Author: Duccio Rocca & Yoshimasa Iwano, Team: 07

    Course: CSC648 SFSU

 */


const checkUsername = (username) => {

    let usernameChecker = /^\D\w{2,}$/;
    return usernameChecker.test(username);
};

const checkPassword = (password) => {
    let passwordChecker = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return passwordChecker.test(password);
};

const usernameValidation = (req, res, next) => {
    let username = req.body.username;
    if (!checkUsername(username)) {

        req.flash('error', 'Invalid username; Minimum length 2 and it must start with an alphabetical character');
        req.session.save(err => {

            res.redirect("/signup");
        });
    } else {
        next();
    }
};

const passwordValidation = (req, res, next) => {

    let password = req.body.password;
    let confirmPass = req.body.matchPassword;

    if (!checkPassword(password)) {

        req.flash('error', 'Invalid password');
        req.session.save(err => {

            res.redirect("/signup");
        });
    } else {
        if (password === confirmPass) {
            next();
        } else {
            req.flash('error', "Passwords don't match");
            req.session.save(err => {

                res.redirect("/signup");
            });
        }

    }
};

const postValidation = (req, res, next) => {

    let title = req.body.PostTitle;
    let description = req.body.PostDescription;
    let fk_userId = req.session.userId;
    let fileUploaded = req.file.path;

    if (fileUploaded == null) {
        req.flash('error', 'Invalid File');
        req.session.save(err => {

            res.redirect("/post");
        });
    } else {


        if (title == null) {
            req.flash('error', 'Invalid Title');
            req.session.save(err => {

                res.redirect("/post");
            });
        } else {
            if (description == null) {
                req.flash('error', 'Invalid Description');
                req.session.save(err => {

                    res.redirect("/post");
                });
            } else {
                if (fk_userId == null) {
                    req.flash('error', 'Invalid UserId');
                    req.session.save(err => {

                        res.redirect("/post");
                    });
                } else {
                    next();
                }
            }

        }
    }
};


module.exports = {usernameValidation, passwordValidation, postValidation};