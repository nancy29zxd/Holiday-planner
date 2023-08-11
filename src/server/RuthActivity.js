/* add & update (add & delete comments) activity*/
const express = require("express");
const router = express.Router();

const { ObjectId } = require('mongodb');
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

const MongoClient = require('mongodb').MongoClient;
const config = require('./config-db.js');
const url = `mongodb://${config.username}:${config.password}@${config.url}:${config.port}/${config.database}?authSource=admin`;
const client = new MongoClient(url, { useUnifiedTopology: true });
let collection = null;


client.connect()
    .then(
        connection => {
            //if collection is not present it is automatically created 
            collection = client.db().collection(config.collection); //comment this when createCollection() is uncommented
            console.log("Activity: connected to Database");
        }
    )
    .catch(err => {
        console.log(`Error in connecting to Database ${url.replace(/:([^:@]{1,})@/, ':****@')}`, err);
    })
// .then(() => insertOneStarterData()) //invoke insert data for loading initial data


//MongoDB set up and start server end

//Server End points start

//Endpoint to get trips/activities with latitude
//per Ruth: This might be problematic?
router.post('/search', function (request, response) { // curl command : curl 'http://localhost:8000/tourism/56.33963344069176/-2.8083373765679336'
    var minLat = Math.min(parseFloat(request.body.topLeftLat), parseFloat(request.body.bottomRightLat));
    var minLon = Math.min(parseFloat(request.body.topLeftLon), parseFloat(request.body.bottomRightLon));
    var maxLat = Math.max(parseFloat(request.body.topLeftLat), parseFloat(request.body.bottomRightLat));
    var maxLon = Math.max(parseFloat(request.body.topLeftLon), parseFloat(request.body.bottomRightLon));

    console.log(minLat, maxLat);
    console.log(minLon, maxLon);

    // const topLeftLat = 56.40453; //[ 56.404531481154564, -2.905563862870699 ]
    // const topLeftLon = -2.90556;
    // const bottomRightLat = 56.27472;
    // const bottomRightLon = -2.67137;

    //console.log("-2.63254" > "-2.98413" ? "yes" : "no");
    console.log(maxLon > minLon ? "yes" : "no");

    collection.find(
        {
            lat: { $gte: minLat, $lte: maxLat },
            long: { $gte: minLon, $lte: maxLon }
        }).toArray()
        .then(doc => {
            console.log(doc);
            if (doc != null) {
                response.status(200).json(doc);
            } else {
                response.status(400).json({ message: `No result for ${LON}` })
            }
        })
        .catch(err => {
            console.log(err);
            response.status(400).json({ message: `No result for ${LON}` })
        });

});


const validateActivity = function (json) {

    if (!json.hasOwnProperty('activityName')) {
        throw new Error("Missing name");
    }

    if (!json.hasOwnProperty('lat')) { // change to follow the front-end data structure
        throw new Error("Missing latitude");
    }
    if (!json.hasOwnProperty('long')) { // change to follow the front-end data structure
        throw new Error("Missing longitude");
    }
    if (!json.hasOwnProperty('location')) {
        throw new Error("Missing location");
    }

    if (json.hasOwnProperty('images')) {
        // transform img
    } else {
        throw new Error("Missing images");
    }

    if (!json.hasOwnProperty('type')) {
        throw new Error("Missing type");
    }
    if (!json.hasOwnProperty('price')) {
        throw new Error("Missing price");
    }


    return {
        activityName: json.activityName, lat: parseInt(json.lat), long: parseInt(json.long), location: json.location,
        age: json.age, type: json.type, price: json.price,
        description: json.description, images: json.images, reviews: []
    };
}

/* 
add activity
@path: /activity/add
@body: {json}: activity: activity json, assuming follow the data structure that Yash inserted
 */

// should we post id? or let the server generate id?
router.post('/add', function (request, res) {
    var data = request.body;
    // var activity = json;
    // console.log(data)
    var activity = validateActivity(data);
    console.log("activity")
    var lat = activity.lat;
    var long = activity.long;
    var activityName = activity.activityName;
    console.log(typeof (lat))
    collection.find(
        {
            $and: [
                { lat: lat }
                ,
                { long: long }]
        }).toArray()
        .then(doc => {
            // console.log(doc)
            if (!doc.length) {

                collection.insertOne(activity)
                    .then(() => {
                        res.status(200).json({ msg: `activity ${activity.activityName} added` })
                        console.log("Added activity ", activity.activityName);
                    })
                    .catch(err => {
                        console.log("err")
                        res.status(400).json({ msg: `Could not add activity ${activity.activityName}` })
                    })
            } else {
                console.log("err")
                res.status(400).json({ msg: `Could not add duplicates activity ${activity.activityName}` })
            }
        }

        ).catch(err => console.log("err"))



})

// get all activities
router.get('/get', function (req, res) {
    collection.find({}).toArray()
        .then(doc => {
            res.status(200).json(doc)
            console.log('find all')
            console.log(doc)
        })
        .catch(err => {
            console.log("could not find activitiy" + err)
            res.status(400).json({ msg: `Could not find activity` })
        })

})


router.delete('/delete/:id', function (req, res) {
    var id = req.params.id;
    collection.deleteOne({ _id: new ObjectId(id) })
        .then(() => {
            console.log("Deleted activity with id", id);
            res.status(200).json({ msg: `Deleted activity with id ${id}` })

        })
        .catch(err => {
            console.log("Could not delete", err.message);
            res.status(400).json({ msg: `Could not delete activity ${id}` })
        })
})






// delete activities by name (for delete testing data)
// router.delete('/delete/:NAME', function (req, res) {
//     var activityName = req.params.NAME;
//     collection.deleteMany({ activityName: activityName })
//         .then(() => {
//             console.log("Deleted many ", activityName);
//             res.status(200).json({ msg: `Deleted activity ${activityName}`, docs })

//         })
//         .catch(err => {
//             console.log("Could not delete", err.message);
//             res.status(400).json({ msg: `Could not delete activity ${activityName}` })
//         })
// })


module.exports = router;