const mongoose = require('mongoose');

const mongoUrl = process.env.MONGODB_URL  || 'mongodb://127.0.0.1:27017/remecore'



mongoose.connect('mongodb://127.0.0.1:27017/remecore', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected!!');
}).catch(err => {
    console.log('Failed to connect to MongoDB', err);
});





module.exports = mongoose
