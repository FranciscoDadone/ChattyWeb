const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const DatabaseHandler = require('./../controller/DatabaseHandler');

//Home page
router.get('/', (req, res) => {
    res.render('login', {
        title: 'Chatty - Login',
    });
});

//Login page
router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Chatty - Login',
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

//Register handler -----------------------------------------------------------------------
router.post('/register', (req, res) => {
    let errors = [];
    const { username, email, password, password2 } = req.body;

    //Check required fields
    if(!email || !username || !password || !password2) {
        errors.push({ msg: '<!> Please fill all fields.' });
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
// END OF: Register handler -----------------------------------------------------------------------

//Login Handler
router.post('/login', (req, res) => {
    let errors = [];
    const { username, password } = req.body;
    
    if(username == null || password == null) {
        errors.push("<!> Please fill all fields");
    }
    
    DatabaseHandler.loginAuth(username, password, (isAuth) => {
        
        console.log(isAuth);
        if(isAuth) {
            res.render('home');
        } else {
            errors.push({ msg: "<!> Username or password incorrect." });
        }
        if(errors.length > 0) {
            console.log("User error at login: ", errors);
            res.render('login', {
                title: 'Chatty - Login',
                errors,
                username
            });
        }  
    });


});


module.exports = router;