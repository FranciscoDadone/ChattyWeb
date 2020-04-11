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

//Register handle
router.post('/register', (req, res) => {
    let errors = [];
    const { username, email, password, password2 } = req.body;

    //Check required fields
    if(!email || !username || !password || !password2) {
        errors.push({ msg: 'Please fill all fields.' });
    }

    // Check password match
    if(password !== password2) {
        errors.push({ msg: "Passwords don't match" });
    }

    //Check password lenght
    if(password.lenght < 6) {
        errors.push({ msg: 'Password should be at least 6 characters!' });
    }


    if(errors.length > 0) {
        res.render('register', {
            page: 'register',
            title: 'Chatty - Registro',
            errors,
            username,
            email
        });
        console.log("Register attempt ERRORS: ", errors);
    } else {
        res.send("Success");
    }

    
});



module.exports = router;