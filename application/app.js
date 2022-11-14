const express = require('express');
const createError = require("http-errors");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");
const path = require("path");
const {engine} = require("express-handlebars");
const favicon = require('serve-favicon');
const {requestPrint, errorPrint, successPrint} = require('./helpers/debugprinters');
var bodyParser = require('body-parser');

// REACTIVATE
var flash = require('express-flash');
var sessions = require('express-session');
var sqlSession = require('express-mysql-session')(sessions);
var mysqlSessionStore = new sqlSession({ /* default options */}, require('./database/database'));

const app = express();
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))); 

var urlencodedParser = bodyParser.urlencoded({ extended: false });

// REACTIVATE
app.use(sessions({
    key:"csID",
    secret:"secret",
    store: mysqlSessionStore,
    resave: false,
    saveUninitialized: false

}));
app.use(flash());

app.engine(
    'handlebars',
    engine({
        layoutsDir: path.join(__dirname, "views/layout"), //where to look for layouts
        partialsDir: path.join(__dirname, "views/partials"), // where to look for partials
        extname: ".handlebars", //expected file extension for handlebars files
        defaultLayout: "home", //default layout for app, general template for all pages in app
        helpers: {
            
            emptyObject : (obj) => {
                if(obj){
                    return !(obj.constructor === Object && Object.keys(obj).length == 0);
                }
                
            }

        }, //adding new helpers to handlebars for extra functionality
    })
);

// view engine setup
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use("/", indexRouter); // route middleware from ./routes/index.js
app.use("/users", usersRouter); // route middleware from ./routes/users.js
app.use("/posts", postsRouter); // route middleware from ./routes/posts.js


app.use("/public", express.static(path.join(__dirname, 'public')));


app.listen(1234, () => console.log('Server running on port 1234'));

/*
 * Catch all route, if we get to here then the
 * resource requested could not be found.
 */
app.use((req, res, next) => {
    next(createError(404, `The route ${req.method} : ${req.url} does not exist.`));
})


/**
 * Error Handler, used to render the error html file
 * with relevant error information.
 */
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = err;
    errorPrint(err);
    // render the error page
    res.status(err.status || 500);
    res.render("error");
});
