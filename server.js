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
    case "charles": 
        port = process.env.CHARLESPORT || 2345;
        break;
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
var UserDB     = require('./models/usersDB')


// ROUTES FOR OUR API
// =============================================================================
const userRouter = require('./routes/users');              // get an instance of the express Router
const authRouter = require('./routes/auth');              // get an instance of the express Router


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /auth

app.use('/auth', authRouter);
app.use('/users', userRouter);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port + " and SSL via nginx proxy  dev: 8491, staging: 8492, live:8000 ");
