const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'your_default_mongo_uri_here';

const connectDB = () => {
  mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true, 
    useCreateIndex: true, 
    useFindAndModify: false, 
    writeConcern: { w: 'majority', wtimeout: 2500 }, 
  })
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));
};

module.exports = connectDB;
