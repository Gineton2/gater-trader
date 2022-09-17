const express = require('express');
const createError = require("http-errors");
const indexRouter = require("./routes/index");
const path = require("path");
const {engine} = require("express-handlebars");

const app = express();



app.engine(
    'handlebars',
    engine({
        layoutsDir: path.join(__dirname, "views"), //where to look for layouts
        partialsDir: path.join(__dirname, "views/partials"), // where to look for partials
        extname: ".handlebars", //expected file extension for handlebars files
        defaultLayout: "home", //default layout for app, general template for all pages in app
        helpers: {
            emptyObject : (obj) => {
                return !(obj.constructor === Object && Object.keys(obj).length == 0);
            }

        }, //adding new helpers to handlebars for extra functionality
    })
);

// view engine setup
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use("/", indexRouter); // route middleware from ./routes/index.js


app.use("/public", express.static(path.join(__dirname, 'public')));

app.listen(1234, () => console.log('Server running on port 1234'));