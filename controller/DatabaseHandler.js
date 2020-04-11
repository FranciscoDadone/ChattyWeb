const MongoClient = require('mongodb').MongoClient;
const url = require('../config/keys').mongoURI;

const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

//Handle generate a unique id for that username

function registerNewUser(username, email, password) {

    try {

        client.connect((err) => {
            if(err) throw err;
    
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
                        console.log('New user registered: ', username, "#",generatedUserID);
                    });
    
    
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
    var emailInUse;
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
        });
        

    } catch(err) {
        console.log("Error connecting to database: ", err);
    } finally {
        client.close();
    }
}










module.exports = { registerNewUser, isAlreadyRegistered };