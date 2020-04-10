const express = require('express');
const path = require('path');
const logger = require('./middlewares/logger');
const expressLayouts = require('express-ejs-layouts');
const PORT = process.env.PORT || 5000;

const app = express();


// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');


// Init logger middleware
app.use(logger);

app.use('/', require('./Routes/index'));
//app.use('/users', require('./Routes/users'));

// Public folder
app.use(express.static("public"));

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});