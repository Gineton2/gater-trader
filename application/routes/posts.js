/* 
    Filename: posts.js

    Purpose: Uses middleware to execute search
    and provide index layout of results.
    Also adds files to storage wth filename and mimetype.

    Author: Duccio Rocca, Yoshimasa Iwano, Team: 07

    Course: CSC648 SFSU 
*/

var express = require("express");
var db = require("../database/database");
const fs = require("fs-extra");

var router = express.Router();

var sharp = require("sharp");
var multer = require("multer");
var crypto = require("crypto");

var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const UserModel = require('../models/users-model');
const UserError = require("../helpers/error/UserError");


const {
  requestPrint,
  errorPrint,
  successPrint,
} = require("../helpers/debugprinters");
var PostError = require("../helpers/error/PostError");
const { postValidation } = require("../middleware/validation");
const {
  doTheSearch,
  getTargetPostById,
  findReceiver,
  sendReply
} = require("../middleware/postsMiddleware");

var PostModel = require("../models/posts-model");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let { category } = req.body;

    if (category == 1) {
      category = "Videos";
    }
    if (category == 2) {
      category = "Music";
    }
    if (category == 3) {
      category = "Ebooks";
    }
    if (category == 4) {
      category = "Slides";
    }
    if (category == 5) {
      category = "Images";
    }

    cb(null, `public/uploads/${category}`);
  },
  filename: function (req, file, cb) {
    let fileExt = file.mimetype.split("/")[1];
    let randomName = crypto.randomBytes(22).toString("hex");
    cb(null, `${randomName}.${fileExt}`);
  },
});

var uploader = multer({ storage: storage });

router.post("/logged", async (req, res, next) => {
  try {
    if (req.session.username) {

        res.send({
            logged: true,
            author_username: req.session.username,
            author_id: req.session.userId,
            
        });
    
    } else {
        res.send({
            logged: false,
            
        });
    
    }
  } catch (err) {
    next(err);
  }
});

router.post("/send", findReceiver, (req, res, next) => {
    res.redirect("/");
  });

router.post("/sendReply", sendReply, (req, res, next) => {
    res.redirect("../dashboard");
});


router.post("/search", doTheSearch, function (req, res, next) {
  res.render("index");
});

router.post( "/createPost", uploader.single("upload"), postValidation,  async function (req, res, next) {


  

  let fk_userId;
  let username;
  console.log("req.session.userId: "+req.session.userId);
  console.log("req.body.usernameSend: "+req.body.usernameSend);

  if(req.session.userId==null && req.body.usernameSend==''){
    
    let email = req.body.emailSend;
    let password = req.body.passSend;
    

    console.log("inside createPost Login");
    await UserModel.authenticate(email,password)
          .then((userInfo) => {
            if (userInfo != -1) {

                successPrint(`User ${userInfo.username} is logged in`);
                console.log("userInfo.userId: "+userInfo.userId);

                req.session.username = userInfo.username;
                req.session.userId = userInfo.userId;
                
                fk_userId = userInfo.userId;
                username = userInfo.username;

                req.session.save();
                return;
                
            } else {
                throw new UserError("Invalid Email or Password", '', 200);
            }

        })
        .catch((err) => {
            errorPrint("user login failed")
            if (err instanceof UserError) {

                req.flash('error', err.getMessage());
                errorPrint(err.getMessage());
                res.status(err.getStatus());
                res.redirect('back');
                

            } else {
                res.redirect('back');
                
            }

        });


  }else if(req.session.userId==null && !req.body.usernameSend==''){

    username = req.body.usernameSend;
    console.log("creating..."+username);
    let email = req.body.emailSend;
    let password = req.body.passSend;

    await UserModel.usernameExists(username)
    .then((usernameDoesExits) => {
        if(usernameDoesExits){
            throw new UserError(
                "Registration failed: Username already exists",
                "",
                200
            );
        }else{
            return UserModel.emailExists(email);
        }
    })
    .then((emailDoesExists) => {
        if(emailDoesExists){
            throw new UserError(
                "Registration failed: Email already exists",
                "",
                200
            );
        }else{
            return UserModel.create(username, password, email);
        }
    })
    .then((createUserId)=>{
        if(createUserId < 0){
            throw new UserError(
                "Server Error: user could not be created",
                "",
                500
            );
        }else{
            fk_userId = createUserId;
            successPrint("User.js --> User was created");
            return;
        }
    })
    .catch((err) => {

        errorPrint("User could not be made", err);
        // req.flash('error', 'Error: user could not be created');
        req.session.save(err => {

            res.redirect("/make-post");
        });

        if (err instanceof UserError) {
            errorPrint(err.getMessage());
            req.flash('error', err.getMessage());
            res.status(err.getStatus());
            res.redirect('/make-post');
        } else {
            next(err);
        }})

  }

  
    try{

  
    // starts the uploading
    if(fk_userId == null){
      fk_userId = req.session.userId;
      username = req.session.username;
    }

    let fileUploaded = req.file.path;

    let fileAsThumbNail = `thumbnail-${req.file.filename}`;
    let destinationOfThumbnail = req.file.destination + "/" + fileAsThumbNail;
    let title = req.body.PostTitle;
    let description = req.body.PostDescription;
    
    let category = req.body.category;
    let price = req.body.price;

    if (category == 1) {
      //VIDEOS

      const p1 = new Promise((resolve, reject) => {
        
        destinationOfThumbnail = "../" + fileUploaded;
        resolve(
          PostModel.create(
            title,
            description,
            fileUploaded,
            destinationOfThumbnail,
            fk_userId,
            price,
            category
          )
        );
      })
        .then((postWasCreated) => {
          if (postWasCreated) {
            req.flash("success", `Hi ${username}, Your Post was created successfully!`);
            res.locals.logged = true;
            res.locals.username = username;
            req.session.save(err => {res.redirect('/')});
          } else {
            throw new PostError("Post could not be created!!", "/post", 200);
          }
        })
        .catch((err) => {
          if (err instanceof PostError) {
            errorPrint(err.getMessage());
            req.flash("error", err.getMessage());
            res.status(err.getStatus());
            req.session.save(err => {res.redirect('/make-post')});
          } else {
            errorPrint(err.message);
            req.flash("error", err.message);
            res.status(err.status);
            req.session.save(err => {res.redirect('/make-post')});
          }
        });
    } else if (category == 2) {
      //MUSIC

      const p1 = new Promise((resolve, reject) => {
        destinationOfThumbnail = "../public/images/audio_image.jpg";
        resolve(
          PostModel.create(
            title,
            description,
            fileUploaded,
            destinationOfThumbnail,
            fk_userId,
            price,
            category
          )
        );
      })
        .then((postWasCreated) => {
          if (postWasCreated) {
            req.flash("success",`Hi ${username}, Your Post was created successfully!`);
            res.locals.logged = true;
            res.locals.username = username;
            req.session.save(err => {res.redirect('/')});
          } else {
            throw new PostError("Post could not be created!!", "/post", 200);
          }
        })
        .catch((err) => {
          if (err instanceof PostError) {
            errorPrint(err.getMessage());
            req.flash("error", err.getMessage());
            res.status(err.getStatus());
            req.session.save(err => {res.redirect('/make-post')});
          } else {
            errorPrint(err.message);
            req.flash("error", err.message);
            res.status(err.status);
            req.session.save(err => {res.redirect('/make-post')});
          }
        });
    } else if (category == 5) {
      //IMAGES

      sharp(fileUploaded)
        .resize(200)
        .toFile(destinationOfThumbnail)
        .then(() => {
          destinationOfThumbnail = "../" + destinationOfThumbnail;
          return PostModel.create(
            title,
            description,
            fileUploaded,
            destinationOfThumbnail,
            fk_userId,
            price,
            category
          );
        })
        .then((postWasCreated) => {
          if (postWasCreated) {
            req.flash("success", `Hi ${username},Your Post was created successfully!`);
            res.locals.logged = true;
            res.locals.username = username;
            req.session.save(err => {res.redirect('/')});
          } else {
            throw new PostError("Post could not be created!!", "/post", 200);
          }
        })
        .catch((err) => {

          if (err instanceof PostError) {
            errorPrint(err.getMessage());
            req.flash("error", err.getMessage());
            res.status(err.getStatus());
            req.session.save(err => {res.redirect('/make-post')});
          } else {
            errorPrint(err.message);
            req.flash("error", err.message);
            res.status(err.status);
            req.session.save(err => {res.redirect('/make-post')});
          }

        });
    } else if (category == 3) {
      //Ebooks

      const p1 = new Promise((resolve, reject) => {
        destinationOfThumbnail = "../public/images/icons/eBook1.jpeg";
        resolve(
          PostModel.create(
            title,
            description,
            fileUploaded,
            destinationOfThumbnail,
            fk_userId,
            price,
            category
          )
        );
      })
        .then((postWasCreated) => {
          if (postWasCreated) {
            req.flash("success", `Hi ${username}, Your Post was created successfully!`);
            res.locals.logged = true;
            res.locals.username = username;
            req.session.save(err => {res.redirect('/')});
          } else {
            throw new PostError("Post could not be created!!", "/post", 200);
          }
        })
        .catch((err) => {
          if (err instanceof PostError) {
            errorPrint(err.getMessage());
            req.flash("error", err.getMessage());
            res.status(err.getStatus());
            req.session.save(err => {res.redirect('/make-post')});
          } else {
            errorPrint(err.message);
            req.flash("error", err.message);
            res.status(err.status);
            req.session.save(err => {res.redirect('/make-post')});
          }
        });
    } else if (category == 4) {
      //Slides

      const p1 = new Promise((resolve, reject) => {
        destinationOfThumbnail = "../public/images/icons/course.jpeg";
        resolve(
          PostModel.create(
            title,
            description,
            fileUploaded,
            destinationOfThumbnail,
            fk_userId,
            price,
            category
          )
        );
      })
        .then((postWasCreated) => {
          if (postWasCreated) {
            req.flash("success", `Hi ${username}, Your Post was created successfully!`);
            res.locals.logged = true;
            res.locals.username = username;
            req.session.save(err => {res.redirect('/')});
          } else {
            throw new PostError("Post could not be created!!", "/post", 200);
          }
        })
        .catch((err) => {
          if (err instanceof PostError) {
            errorPrint(err.getMessage());
            req.flash("error", err.getMessage());
            res.status(err.getStatus());
            req.session.save(err => {res.redirect('/make-post')});
          } else {
            errorPrint(err.message);
            req.flash("error", err.message);
            res.status(err.status);
            req.session.save(err => {res.redirect('/make-post')});
          }
        });
    }

    }catch(err){

      console.log("inside catch all errors ");
      errorPrint(err.message);
      res.status(err.status);
      req.flash("error", err.message);
      req.session.save(err => {res.redirect('/make-post')});

    }
  }
);

router.get("/:id(\\d+)", getTargetPostById, (req, res, next) => {
  res.render("message");
});

module.exports = router;