const express = require('express');
const path = require('path');
const logger = require('./middlewares/logger');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');

const PORT = process.env.PORT || 5000;

const app = express();

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Bodyparser
app.use(express.urlencoded({ extended: false }));

// Init logger middleware
app.use(logger);

//Express Session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//Index route
app.use('/', require('./Routes/index'));

// Public folder
app.use(express.static("public"));

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});