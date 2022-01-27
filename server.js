// BASE SETUP
// =============================================================================

// call the packages we need
const express    = require('express');        // call express
const bodyParser = require('body-parser');
const dotenv     = require('dotenv');
const random     = require('generate-random-data');
const bcrypt     = require('bcrypt')
const jwt        = require('jsonwebtoken')
const path       = require('path');
const fs         = require('fs');


// get config vars
dotenv.config();

// define our app using express
const app        = express();                 

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// SET PORT

var port = 80;

switch (process.env.NODE_ENV) {
    case "dev": 
        port = process.env.DEVPORT || 3456;
        break;
    case "staging": 
        port = process.env.STAGINGPORT || 4567;
        break;
    case "live":
        port = process.env.LIVEPORT || 5678;
        break;
    default:
        port = 80;
}



// access config var
process.env.PUBLIC_KEY;
process.env.PRIVATE_KEY;

// public key
const publickey = fs.readFileSync(path.resolve(process.env.PUBLIC_KEY)) 
// private key
const privateKey = fs.readFileSync(path.resolve(process.env.PRIVATE_KEY)) 

// Database user
var User     = require('./models/users')


// ROUTES FOR OUR API
// =============================================================================
const auth = express.Router();              // get an instance of the express Router
const users = express.Router();              // get an instance of the express Router

// auth
// =============================================================================

// auth GET verification_key
// Return public key
auth.get('/verification_key',  (req, res, next) => {
    res.status(200).send(publickey.toString('ascii'))
})

// auth POST register
auth.post('/register',  (req, res, next) => {

    // check if username already used
    User.findOne({username: req.body.email},  (err, loginUser) => {
        
        
        if (err) { 
            // Broken
            return res.sendStatus(401) 
        }
        
        if (loginUser === null) { 
            // user doesn't exist so create new user
            var id = random.guid()
    
            // create password and save
            bcrypt.hash(req.body.password, 10,  (err, hash) => {
                if (err) { return next(err) }
                // create new user
                var user = new User({id: id,
                    username: req.body.username, 
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    password: hash
                }) //new User
                
                user.save( (err)  =>  {
                    if (err) { return next(err) }
                    console.log("Register new user username: "+req.body.username+" id: "+id)
                    return res.status(201).json({id: id}) // User created
                    
                }) //user.save
            }) // bcrypt.hash
        } else {
            // Duplicate username not allowed
            return res.status(409).send('Duplicate UserName not allowed') 
        } 
    }) // User.findOne

   
})

// auth POST login

auth.post('/login',  (req, res, next)  =>  {
    
    User.findOne({username: req.body.username},  (err, loginUser) => {
        
        if (err) { 
            // invalid username return unknown user error
            return res.sendStatus(401) 
        }
        
        if (loginUser) {
            var hashFromDB = loginUser.password
            var plainPassword = req.body.password
            bcrypt.compare(req.body.password, loginUser.password,  (err, valid) => {
                if (err) { 
                    return next(err) 
                }
                if (!valid) { 
                    return res.sendStatus(401) 
                }
    
                jwt.sign({username: loginUser.username}, privateKey, { algorithm: 'RS512' , expiresIn: '1h' },  (err, token) => {       
                    if (err) { 
                        return next(err) 
                    }
                    console.log("User Login: "+loginUser.username)
                    return res.status(200).send(token)
                    
                }) //jwt.sign
            })//bcrypt.compare
        } else {
            return res.sendStatus(401) 
        }
        
    }) // User.findOne
}) //auth.post




// Users
// =============================================================================


// GET user/<id>
users.get('/',  (req, res, next)  => {
    User.findOne({id: req.body.id},  (err, user) => {
        if (err) { 
            return next(err) // invalid username return unknown user error
        }
        if (user === null) {
            return res.sendStatus(404) // not found
        }     
        return res.send(user) // Return User
      })
})

users.post('/', (req, res) => {   
    res.json({ message: 'Welcome to reme-core users api!' });
});
users.put('/', (req, res) => {   
    res.json({ message: 'Welcome to reme-core users api!' });
});
users.delete('/', (req, res) => {
    res.json({ message: 'Welcome to reme-core users api!' });
});


// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /auth
app.use('/auth', auth);
app.use('/users', users);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port + " and SSL via nginx proxy  dev: 8491, staging: 8492, live:8000 ");
