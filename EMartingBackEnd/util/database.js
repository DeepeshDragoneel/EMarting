const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (func) => {
    MongoClient.connect(
      p
    )
    .then((result) => {
            console.log("Connected to DataBase");
            _db = result.db();
            func();
        }
    )
    .catch(error => {
        console.log(error)
        throw error;
    });
}

const getdb = () => {
    if (_db) {
    return _db;
    }
    throw "No DataBase Found?";
}

exports.mongoConnect = mongoConnect;
exports.getdb = getdb;