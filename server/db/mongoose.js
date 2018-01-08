const mongoose = require('mongoose', { useMongoClient: true });

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

module.exports = { mongoose };