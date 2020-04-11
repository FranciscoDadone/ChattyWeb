const express = require('express');
const router = express.Router();
const User = require('../classes/User');
const bcrypt = require('bcrypt');
const DatabaseHandler = require('./../controller/DatabaseHandler');

//Home page
router.get('/', (req, res) => {
    res.render('welcome', {
        title: 'Chatty'
    });
});

//Login page
router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Chatty - Login',
        register_success: false
    });
});

//Register page
router.get('/register', (req, res) => {
    let errors = [];
    res.render('register', {
        page: 'register',
        title: 'Chatty - Register',
        errors
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
        errors.push({ msg: "<!> Passwords don't match." });
    }

    //Check password lenght
    if(password.lenght < 6) {
        errors.push({ msg: '<!> Password should be at least 6 characters!' });
    }


    //Handle if the email is already registered
    DatabaseHandler.isAlreadyRegistered(email, (emailInUse) => {
        
        if(emailInUse) {
            errors.push({ msg: '<!> That email is already registered.' });
        }

        //If there is any error it will prompt it and don´t generate the new account 
        if(errors.length > 0) {
            res.render('register', {
                page: 'register',
                title: 'Chatty - Registro',
                errors,
                username,
                email
            });
            console.log("User error reported: ", errors);
        } else {
    
            //Hash user password
            bcrypt.genSalt(10, (err, salt) => 
                bcrypt.hash(password, salt, (err, hash) => {
                    if(err) throw err;
    
                    //Registering new user after hashing the password.
                    DatabaseHandler.registerNewUser(username, email, hash);
    
            }));
    
            res.render('login', {
                register_success: true,
                title: 'Chatty - Login'
            });
    
    
        }

    });

});



module.exports = router;