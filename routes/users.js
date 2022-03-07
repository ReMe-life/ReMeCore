var express = require('express')

//var bcrypt   = require('bcrypt')
//var jwt      = require('jsonwebtoken')
var UserDB     = require('../models/usersDB')

var users  = express.Router()




// Users
// =============================================================================


// GET user/<id>
users.get('/:userId',  (req, res)  => {
    UserDB.findOne({id: req.params.userId},  (err, user) => {
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






module.exports = users
