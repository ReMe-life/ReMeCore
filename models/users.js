var db = require('../db')
var User = db.model('User',{
  id: { type: String, required: true },
  password: { type: String, required: true },
  firstname: { type: String},
  lastname: { type: String },
  username: { type: String, required: true },
  email: { type: String }
})
module.exports = User




