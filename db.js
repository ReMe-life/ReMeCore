const mongoose = require('mongoose');

var mongoUrl = process.env.MONGODB_URL  || 'mongodb://127.0.0.1:27017/remecore';

switch (process.env.NODE_ENV) {
    case "dev": 
        mongoUrl = process.env.DEV_MONGODB_URL;
        break;
    case "staging": 
        mongoUrl = process.env.STAGING_MONGODB_URL;
        break;
    case "live":
        mongoUrl = process.env.LIVE_MONGODB_URL;
        break;
    default:
        mongoUrl = 'mongodb://127.0.0.1:27017/remecore';
}

console.log("Mongo: "+mongoUrl)
mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected!!');
}).catch(err => {
    console.log('Failed to connect to MongoDB', err);
});





module.exports = mongoose
