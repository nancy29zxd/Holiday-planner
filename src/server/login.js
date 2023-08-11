const MongoClient = require('mongodb').MongoClient;
const express = require("express");
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());


//MongoDB set up ans start server
//build url for config file info
const config = require('./config-db.js');
const { password } = require('./config-db.js');
const url = `mongodb+srv://${config.username}:${config.password}@cluster0.uygwfic.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(url, { useUnifiedTopology: true });
let collectionLogin = null; // initially null 


//Insert some data for testing  
const insertOneStarterDataLogin = async function () {
    return collectionLogin.insertMany([
        // { _id: "test@gmail.com", userEmail: "test@gmail.com", userName: "Test", password: "test@123" },
        { _id: "yash@gmail.com", userEmail: "yash@gmail.com", userName: "Yash", password: "yash@123" }])
        .then(res => console.log("data inserted with ID", res.insertedIds))
        .catch(err => {
            console.log("Could not add data ", err.message);
            //For now, ingore duplicate entry errors, otherwise re-throw the error for the next catch
            if (err.name != 'MongoBulkWriteError' || err.code != 11000) throw err;
        })
}

//Find data from database based on query
const findMany = async function (query) {
    return collectionLogin.find(query).toArray()
        .catch(err => {
            console.log("Could not find ", query, err.message);
        })
}


//connect to database
client.connect()
    .then(
        connection => {
            //if collection is not present it is automatically created 
            collectionLogin = client.db().collection("login"); //comment this when createCollectionLogin() is uncommented
            console.log("Login: Connected to Database Login");
        }
    )
    .catch(err => {
        console.log(`Error in connecting to Database Login ${url.replace(/:([^:@]{1,})@/, ':****@')}`, err);
    })
//.then(() => createCollectionLogin()) // invoke createCollectionLogin if not created 
//.then(() => insertOneStarterDataLogin()) //invoke insert data for loading initial data 


//MongoDB set up and start server end

//Server End points start

//Endpoint to get trips/activities with latitude
router.post('/login', function (request, response) { // curl command : curl 'http://localhost:8000/tourism/56.33963344069176/-2.8083373765679336'
    console.log(request.body);
    const userEmail = request.body.userEmail; //eg: test@gmail.com
    const password = request.body.password; //eg: test

    collectionLogin.find({ _id: userEmail }, { password: password }).toArray()
        .then(doc => {
            console.log(doc);
            if (doc.length > 0) {
                response.status(200).json({ message: `Login Successful` });
            } else {
                response.status(401).json({ message: `Unauthorised` })
            }
        })
        .catch(err => {
            console.log(err);
            response.status(401).json({ message: `Error finding data` })
        });

})

router.post("/register", function (request, response) {
    const userEmail = request.body.userEmail;
    const userName = request.body.userName;
    const password = request.body.password;

    collectionLogin.find({ _id: userEmail }).toArray()
        .then(doc => {
            console.log(doc);
            if (doc.length == 0) {
                collectionLogin.insertOne({ _id: userEmail, userEmail: userEmail, userName: userName, password: password });
                response.status(200).json({ message: "Success" })
            } else {
                response.status(402).json({ message: "User with this email exists" })
            }
        }).catch(err => {
            console.log(err);
            response.status(404).json({ message: `Error finding data` })
        });
})

module.exports = router;