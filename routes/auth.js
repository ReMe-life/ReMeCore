const express = require('express')
const bcrypt   = require('bcrypt')
const jwt      = require('jsonwebtoken')
const UserDB     = require('../models/usersDB')
const random     = require('generate-random-data');
const path     = require('path');
const fs     = require('fs');
const dotenv = require('dotenv');


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




// auth
// =============================================================================

// auth GET verification_key
// Return public key
auth.get('/verification_key',  (req, res) => {
    res.status(200).json({ public_key: publickey.toString('ascii'), algorithm: "RS512" })
})

// auth POST register
auth.post('/register',  (req, res) => {
    // check if username already used
    UserDB.findOne({username: req.body.email},  (err, loginUser) => {


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
                var user = new UserDB({id: id,
                    username: req.body.username,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    password: hash
                }) //new User

                user.save( (err)  =>  {
                    if (err) { return next(err) }
                    console.log("Register new user username: "+req.body.username+" id: "+id)
                    return res.status(200).json({id: id,username: req.body.username}) // User created

                }) //user.save
            }) // bcrypt.hash
        } else {
            // Duplicate username not allowed
            return res.status(409).send('Duplicate UserName not allowed')
        } 
    }) // User.findOne


})







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
                    return next(err)
                }
                if (!valid) { 
                    return res.sendStatus(401)
                }

                jwt.sign({username: loginUser.username, id: loginUser.id}, privateKey, { algorithm: 'RS512' , expiresIn: '1h' },  (err, token) => {
                    if (err) { 
                        return next(err)
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
}) //auth.post











module.exports = auth
