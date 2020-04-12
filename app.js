const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoClient = require('mongodb').MongoClient;
const url = require('./config/keys').mongoURI;
const MongoDBStore = require('connect-mongodb-session')(session);

const PORT = process.env.PORT || 5000;

const app = express();


// initialize cookie-parser to allow us access the cookies stored in the browser. 
//app.use(cookieParser());


// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Bodyparser
app.use(express.urlencoded({ extended: false }));

// Init logger middleware
app.use(morgan('dev'));


//MONGO 
/*
var store = new MongoDBStore({
    uri: url,
    collection: 'mySessions'
});
   
  // Catch errors
  store.on('error', function(error) {
    console.log(error);
  });

var sess = {
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {},
    store: store
}
if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}
app.use(session(sess));

*/

//Index route
app.use('/', require('./Routes/index'));

// Public folder
app.use(express.static("public"));

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});