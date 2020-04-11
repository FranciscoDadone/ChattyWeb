const MongoClient = require('mongodb').MongoClient;
const url = require('../config/keys').mongoURI;
const bcrypt = require('bcrypt');

const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });




//Handle generate a new user with a unique ID
function registerNewUser(username, email, password) {

    try {

        client.connect((err) => {    
            //Generating user ID
            var generatedUserID = Math.ceil(Math.random(1000,9000)*10000);
            try {
    
                function generateId() {
                    const db = client.db('Chatty');
    
                        db.collection('Users').findOne({
                            ID: generatedUserID,
                            username: username
                        }, (err, value) => {
    
                            if(value != null){
                                generateId();
                            }
                        });
                }
                generateId();
            } catch(err) {
                console.log(err);
            }
    
            // Handle register user
            try {
    
                const db = client.db('Chatty');
    
                    db.collection('Users').insertOne({    //Inserting a user credentials to database
                        ID: generatedUserID,
                        date: Date.now,
                        username: username,
                        email: email,
                        password: password
                    }, (err) => {
                        if (err) throw err;
                        console.log('New user registered: ', username, "#",generatedUserID);
                    });
                    client.close();
    
            } catch(err) {
                console.log(err);
            }
        });

    } catch(err) {
        console.log("Error connecting to database: ", err);
    }

}


//Handle if there is an email already registered in the database
function isAlreadyRegistered(email, callback) {
    try {

        client.connect((err) => {
            const db = client.db('Chatty');
            
            db.collection('Users').findOne({
                email: email
            }, (err, value) => {
                if(value != null) {  
                    callback(true);
                } else {
                    callback(false);
                }
                
            });
            //client.close();
        });
        
    } catch(err) {
        console.log("Error connecting to database: ", err);
    }
}

function loginAuth(username, password, callback) {
    try {

        client.connect((err) => {
            const db = client.db('Chatty');

            db.collection('Users').findOne({
                username: username
            }, (err, value) => {
                if(value != null) {
                    bcrypt.compare(password, value.password, function(err, result) {
                        console.log(result);
                        callback(result);
                    });
                } else {
                    db.collection('Users').findOne({
                        email: username
                    }, (err, value1) => {
                        if(value1 != null) {
                            bcrypt.compare(password, value1.password, function(err, result) {
                                console.log(result);
                                callback(result);
                            });
                        } else {
                            console.log("else");
                            callback(false);
                        }
                    });
                }
            });
            client.close();
        });
    } catch(err) {
        console.log("Error connecting to database: ", err);
        callback(false);
    }
}









module.exports = { registerNewUser, isAlreadyRegistered, loginAuth };
