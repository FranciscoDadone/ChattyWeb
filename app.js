const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const session = require('express-session');
const mongoose = require('mongoose');
const url = require('./config/keys').mongoURI;
const MongoDBStore = require('connect-mongodb-session')(session);
const loginViaCookie = require('./middlewares/loginViaCookie');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 5000;

const app = express();


// Connect to database (MongoDB)
mongoose.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('MongoDB Connected!');
});


// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Bodyparser
app.use(express.urlencoded({ extended: false }));

// Init logger middleware
app.use(morgan('dev'));

//Cookie parser
app.use(cookieParser({
  secret: 'secretCode'
}));

//Index route
app.use("/", loginViaCookie);
app.use('/', require('./Routes/index'));

// Public folder
app.use(express.static("public"));

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});