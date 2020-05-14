const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const DatabaseHandler = require('./../controller/DatabaseHandler');
const loginCookie = require('../cookies/login-cookie');
const loginViaCookie = require('../middlewares/loginViaCookie');


const DAY_IN_MILLISECONDS = (1 * 24 * 60 * 60 * 1000);


//index page
router.get('/', (req, res) => {
    res.redirect('login');
});

//Home page
router.get('/home', loginViaCookie, (req, res) => {
    if(!req.isAuthenticated) {
        res.redirect('/');
    }
    res.render('home', {
        title: 'Chatty',
        email: req.email,
        username: req.username
    })
});

//Logout
router.post('/logout', (req, res) => {
    res.clearCookie('auth');
    res.redirect('/');
});


//Login page
router.get('/login', loginViaCookie, (req, res) => {
    if(!req.isAuthenticated) {
        res.render('login', {
            title: 'Chatty - Login',
            register_success: req.query.valid
        });
    } else {
        res.redirect('/home');
    }
});

//Register page
router.get('/register', loginViaCookie, (req, res) => {
    if(!req.isAuthenticated) {
        let errors = [];
        res.render('register', {
            page: 'register',
            title: 'Chatty - Register',
            errors
        });
    } else {
        res.redirect('/home');
    }
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
    
            res.redirect('login?valid=true', 200, {
                register_success: true,
                title: 'Chatty - Login'
            });
    
        }

    });

});
// END OF: Register handler -----------------------------------------------------------------------

//Login Handler -----------------------------------------------------------------------
router.post('/login', (req, res) => {
    let errors = [];
    const { username, password } = req.body;
    
    if(username == null || password == null) {
        errors.push("<!> Please fill all fields");
    }
    
    DatabaseHandler.loginAuth(username, password, (isAuth, value) => {
        
        if(isAuth) {
            // ACA ES DONDE SE CARGA LA COOKIE DEL LOGIN HASHEADA      res.cookie('userData', value);
            loginCookie.generateCookie(value, (hashedCookie) => {
                res.cookie('auth', hashedCookie, {maxAge: DAY_IN_MILLISECONDS * 1000});
                res.redirect('home');
            });
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
//END OF: Login Handler -----------------------------------------------------------------------





module.exports = router;