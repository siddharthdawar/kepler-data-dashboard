const mongoose = require('mongoose');

const MONGO_URL = 'mongodb+srv://siddharthdawar:lkqc62NqZ9XC4gSm@cluster0.aaersoa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (error) => {
    console.error(error);
});

const connectToMongo = async () => {
    await mongoose.connect(MONGO_URL);
};

const disconnectFromMongo = async () => {
    await mongoose.disconnect();
}

module.exports = {
    connectToMongo,
    disconnectFromMongo
};
