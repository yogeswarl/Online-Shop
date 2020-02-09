const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
  MongoClient.connect(
    "mongodb+srv://yogeswar:Yogi2198@cluster-test-p9hqd.mongodb.net/shop?retryWrites=true&w=majority"
    ).then(client =>{
      console.log('connected!');
      _db = client.db()
      callback();
    }).catch(error=>{
      console.log(error);
      throw error;
    });
  }

  const getDb =() =>{
    if(_db){
      return _db;
    }
    throw 'No Database found';
  }
  exports.mongoConnect = mongoConnect;
  exports.getDb = getDb;