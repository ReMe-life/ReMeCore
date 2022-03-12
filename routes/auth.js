const express = require('express')
const bcrypt   = require('bcrypt')
const jwt      = require('jsonwebtoken')
const UserDB     = require('../models/usersDB')
const random     = require('generate-random-data');
const path     = require('path');
const fs     = require('fs');
const dotenv = require('dotenv');

const nodemailer = require("nodemailer");

const auth  = express.Router()

// get config vars
dotenv.config();

// access config var
process.env.PUBLIC_KEY;
process.env.PRIVATE_KEY;

// public key
const publickey = fs.readFileSync(path.resolve(process.env.PUBLIC_KEY))
// private key
const privateKey = fs.readFileSync(path.resolve(process.env.PRIVATE_KEY))

// Email setup
// create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    //pool: true,
    host: process.env.SMTPSERVER,
    port: process.env.SMTPPORT,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.MAILUSER, // generated ethereal user
      pass: process.env.MAILPASSWD // generated ethereal password
    },
  });

// verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Mail server "+process.env.SMTPSERVER+" is ready to take our messages");
  }
});

// auth
// =============================================================================

// auth GET verification_key
// Return public key
auth.get('/verification_key',  (req, res) => {
    res.status(200).json({ public_key: publickey.toString('ascii'), algorithm: "RS512" })
})

// auth POST confirm
/*
	Completes a password reset request, setting the user's password to the provided value
	The password reset URL (in the email) contains all of the required fields to make this request except for the new password
	Note that password reset tokens can only be used once and have an expiry

	{
	  "id": "string",
	  "password": "string",
	  "time": 0,
	  "token": "string"
	}

	returns
	200 OK
	400 Bad Request
	404 Not Found
	422 Unprocessable Entity
	429 Too Many Requests
*/

auth.post('/confirm',  (req, res)  =>  {


	jwt.verify(req.body.token, publickey.toString('ascii'), { algorithm: 'RS512'  }, (err, decoded) => {
		if (err) { 
			console.log(err)
			return res.sendStatus(404) } // bad token
		// Decoded token, check user ID
		if (decoded.id != req.body.id) { return res.sendStatus(404) } // Error wrong user	

		// Update password
		bcrypt.hash(req.body.password, 10,  (err, hash) => {
			if (err) { return res.status(422).send('Error hashing password') }

			// update user with new password
			var query = { id: req.body.id }
			UserDB.findOneAndUpdate(query, { password: hash }, { new: true }, (err, updatedUser ) => {
				if (err) { return res.status(422).send('Error updating password') }
				console.log("Updated password for user Id "+req.body.id+"new password hash "+hash)
				console.log(updatedUser)
				return res.status(200).send('OK') // password updated
			}) // End UserDB.findOneAndUpdate
			

		}) // bcrypt.hash
	}) // jwt.verify
		


}) // auth POST confirm

// auth POST register
/*
Registers a new user with the given details. If activation emails are enabled new users will receive an activation email with instructions on how to activate their account. In this case, the user will not be able to login until they complete this process

Note the constraints below:

username must be a valid email address

password must be at least 8 characters

{
  "firstname": "string",
  "lastname": "string",
  "password": "string",
  "username": "string"
}


	returns
	200 OK
	400 Bad Request
	404 Not Found
	422 Unprocessable Entity
	429 Too Many Requests
*/ 

auth.post('/register',  (req, res) => {
    // check if username already used
    UserDB.findOne({username: req.body.email},  (err, loginUser) => {


        if (err) { 
            // Broken
            return res.status(401).send('User not found')
        }

        if (loginUser === null) {
            // user doesn't exist so create new user
            var id = random.guid()

            // create password and save
            bcrypt.hash(req.body.password, 10,  (err, hash) => {
                if (err) { 
            		return res.status(422).send('Error hashing password')
					}
                // create new user
                var user = new UserDB({id: id,
                    username: req.body.username,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    password: hash
                }) //new User

                user.save( (err)  =>  {
                    if (err) { return res.sendStatus(401) }

                    console.log("Register new user username: "+req.body.username+" id: "+id)
                    return res.status(200).json({id: id,username: req.body.username}) // User created

                }) //user.save
            }) // bcrypt.hash
        } else {
            // Duplicate username not allowed
            return res.status(409).send('Duplicate UserName not allowed')
        } 
    }) // User.findOne


}) // auth post register


// auth POST forgot
// Sends a password reset email to the provided email address if a matching user is found
/*  

	{
  	"username": "string"
  	"appid"   : "string"
    }

	returns
	200 OK
	400 Bad Request
	404 Not Found
	422 Unprocessable Entity
	429 Too Many Requests
*/

auth.post('/forgot',  (req, res)  =>  {

    UserDB.findOne({username: req.body.username},  (err, loginUser) => {

        if (err) {
            // invalid username return unknown user error
            return res.sendStatus(401)
        }

        if (loginUser) {
			// user found
	    	// create reset token
	    
           jwt.sign({username: loginUser.username, id: loginUser.id}, privateKey, { algorithm: 'RS512' , expiresIn: '1h' },  (err, token) => {
           		if (err) { 
                    return res.sendStatus(401)
                } else {
                	console.log("User Login: "+loginUser.username)
					// generate email
					let receiverAddress=loginUser.email
					let mailMessage = {
					  from: process.env.MAILUSER, // sender address
					  //to: loginUser.email, // list of receivers
					  to: receiverAddress, // list of receivers
					  subject: "Test from reme-core", // Subject line
					  text: "Test from reme-core", // plain text body
					  html: 'Hello '+loginUser.username+'<br><br>We recieved a request to reset your password.<br>If this request was not made by you, please ignore this email, <br> otherwise <b><a href='+req.body.baseurl+'?token='+token+'>click here </a></b> to reset your password <br>' // html body

					}
					// send mail with defined transport object
					console.log(mailMessage)


					transporter.sendMail( mailMessage, (err, info) => {
						if (err) {
							console.log(err)
							return res.sendStatus(401)
						}
						else {
							return res.sendStatus(200)
						}

						});
				//return res.sendStatus(200)
                return res.status(200).json({username: loginUser.username, id: loginUser.id, token: token}) // token created
				}
            }) //jwt.sign
		} else {
			// user not found
			return res.sendStatus(401)
		}

    }) // User.findOne
}) //auth.post forgot





// auth POST login

auth.post('/login',  (req, res)  =>  {

    UserDB.findOne({username: req.body.username},  (err, loginUser) => {

        if (err) { 
            // invalid username return unknown user error
            return res.sendStatus(401)
        }

        if (loginUser) {
            var hashFromDB = loginUser.password
            var plainPassword = req.body.password
            bcrypt.compare(req.body.password, loginUser.password,  (err, valid) => {
                if (err) { 
                    return res.sendStatus(401)
                }
                if (!valid) { 
                    return res.sendStatus(401)
                }

                jwt.sign({username: loginUser.username, id: loginUser.id}, privateKey, { algorithm: 'RS512' , expiresIn: '1h' },  (err, token) => {
                    if (err) { 
                        return res.sendStatus(401)
                    }
                    console.log("User Login: "+loginUser.username)
                    return res.status(200).json({id: loginUser.id,
                                                 username: loginUser.username,
                                                 jwt: token}) // User logged in
                }) //jwt.sign
            })//bcrypt.compare
        } else {
            return res.sendStatus(401)
        }

    }) // User.findOne
}) //auth.post login











module.exports = auth
