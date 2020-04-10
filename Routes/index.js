const express = require('express');
const router = express.Router();

//Home page
router.get('/', (req, res) => {
    res.render('welcome', {
        page: 'welcome',
        title: 'Chatty'
    });
});

//Login page
router.get('/login', (req, res) => {
    res.render('login', {
        page: 'login',
        title: 'Chatty - Login'
    });
});

//Register page
router.get('/register', (req, res) => {
    res.render('register', {
        page: 'register',
        title: 'Chatty - Register'
    });
});

module.exports = router;