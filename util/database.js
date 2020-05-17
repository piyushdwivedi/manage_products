const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;
let _db;
const connectToMongoDb = (cb) => {
    MongoClient.connect('mongodb+srv://manageproducts:manage123@cluster0-yis49.mongodb.net/shop?retryWrites=true&w=majority')
    .then(client => {
        console.log('Connected to db');
        _db = client.db();
        cb();
    }).catch(err => {
        console.log('Couldnt connect to db', err);
    });
}

const getDb = () => {
    if(_db) {
        return _db;
    }
    throw 'Db not found';
}
exports.connectToMongoDb = connectToMongoDb;
exports.getDb = getDb;