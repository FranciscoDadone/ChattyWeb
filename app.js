const express = require('express');
const path = require('path');
const logger = require('./middlewares/logger');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;

const app = express();

//DB config
const db = require('./config/keys').mongoURI;

//Connect to mongo
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Mongo database connected.'))
    .catch(err => console.log(err));



// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Bodyparser
app.use(express.urlencoded({ extended: false }));

// Init logger middleware
app.use(logger);

//Index route
app.use('/', require('./Routes/index'));

// Public folder
app.use(express.static("public"));

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});