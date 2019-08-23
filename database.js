const mongo = require('mongodb');
const url = 'mongodb://localhost:27017';
const debug = require('debug')('database.js');
module.exports = {
    insert(collection_name, data) {
        mongo.connect(url,  {useNewUrlParse: true}, (err, db) => {
            if (err) {
                debug(err);
                process.exit(0);
            }
            var dbo = db.db('kitbot');
            debug('connected to kitbot database');
            var collection = dbo.collection(collection_name);
            collection.insertOne(data, (err, result) => {
                if (err) {
                    debug(err);
                    process.exit(0);
                }
                console.log(result);
                db.close();
            })
        }
    }
}
