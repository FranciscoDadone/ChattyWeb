const express = require('express');
const path = require('path');
const logger = require('./middlewares/logger');
const app = express();
const PORT = process.env.PORT || 5000;

const users = [
    {
        id: 1,
        name: 'Jhon',
        email: 'jhon@g.com',
        status: 'active'
    },
    {
        id: 2,
        name: 'Jhon1',
        email: 'jhon1@g.com',
        status: 'active'
    },
    {
        id: 3,
        name: 'Jhon2',
        email: 'jhon2@g.com',
        status: 'active'
    }];


// Init logger middleware
app.use(logger);



app.get('/api/users', (req, res) => {

    res.json(users);

});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});