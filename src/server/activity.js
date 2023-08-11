/* add & update (add & delete comments) activity*/
const express = require("express");
const router = express.Router();

const { ObjectId } = require('mongodb');
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

const MongoClient = require('mongodb').MongoClient;
const config = require('./config-db.js');
const url = `mongodb+srv://${config.username}:${config.password}@cluster0.uygwfic.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(url, { useUnifiedTopology: true });
let collection = null;

const path = require("path")
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, 'images'));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });

const upload = multer({ storage: storage });

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
router.post('/search', function (request, response) { // curl command : curl 'http://localhost:8000/tourism/56.33963344069176/-2.8083373765679336'
    
    //Lat Long calculation code

    const R = 6371; // radius of the Earth in km
    const lat1 = toRadians(request.body.LAT); //56.33963, long: -2.78847 //document.getElementById("lat").value;
    const lon1 = toRadians(request.body.LONG);//document.getElementById("long").value;
    // const points = [];
    let distance = request.body.distance;
    
    const radiusKm = (parseInt(distance)-2); 
    console.log(lat1+""+lon1)
    // calculate the latitudinal distance covered by 10km radius
    const latDist = 2 * Math.asin(Math.sin(radiusKm / (2 * R)) / Math.cos(lat1));

    // calculate the longitudinal distance covered by 10km radius
    const lonDist = 2 * Math.asin(Math.sin(radiusKm / (2 * R)) / Math.cos(lat1)) / Math.cos(lat1);

   // console.log([[topLeftLat, topLeftLon], [bottomRightLat, bottomRightLon]]);
    

    //searchFromServer(topLeftLat, topLeftLon, bottomRightLat, bottomRightLon);
    //Lat Long calculation code 
    

    var topLeftLat = parseFloat(toDegrees(lat1 + latDist / 2));
    var topLeftLon = parseFloat(toDegrees(lon1 - lonDist / 2));
    var bottomRightLat = parseFloat(toDegrees(lat1 - latDist / 2));
    var bottomRightLon = parseFloat(toDegrees(lon1 + lonDist / 2));

    console.log(topLeftLat);
    console.log(topLeftLon);
    console.log(bottomRightLat);
    console.log(bottomRightLon);

    // const topLeftLat = 56.40453; //[ 56.404531481154564, -2.905563862870699 ]
    // const topLeftLon = -2.90556;
    // const bottomRightLat = 56.27472;
    // const bottomRightLon = -2.67137;

    console.log("-2.63254" > "-2.98413" ? "yes" : "no");
    console.log(bottomRightLon > topLeftLon ? "yes" : "no");

    collection.find(
        {
            lat: { $gte: bottomRightLat, $lte: topLeftLat },
            long: { $gte: topLeftLon, $lte: bottomRightLon }
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

function toRadians(degrees) {
    return degrees * Math.PI / 180;
}



function toDegrees(radians) {
    return radians * 180 / Math.PI;
}

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

    // make the lat and long be float (by 220022259)
    return {
        activityName: json.activityName, lat: parseFloat(json.lat), long: parseFloat(json.long), location: json.location,
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
    console.log(typeof(lat))
    collection.find(
        {$and: [
            {lat:  lat }
            ,
            {long:  long }]
        }).toArray()
        .then(doc => {
           // console.log(doc)
            if (!doc.length ) {
                
                collection.insertOne(activity)
                    .then(() => {
                        res.status(200).json({ msg: `activity ${activity.activityName} added` })
                        console.log("Added activity ", activity.activityName);
                    })
                    .catch(err => {
                        console.log("err")
                        res.status(400).json({ msg: `Could not add activity ${activity.activityName}` })
                    })
            }else{
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


router.post("/image",upload.single("file"),function (req,res) {
    try {
        const imagePath = path.join(req.file.path);
        res.set(200).json({url:imagePath})
    } catch (error) {
        res.set(400).json({url:""})
    }
    //console.log(imagePath);
 

})


router.get('/get/:id', function (req, res) {
    id = req.params.id;
    collection.findOne({_id:id})
        .then(doc => {
            if (doc) {
                res.status(200).json(doc)
                console.log(`find actiity with id ${id}`)
                console.log(doc)
            }else{
                res.status(400).json({msg:`Could not find activity with id ${id}`})
            }
            
        })
        .catch(err => {
            console.log(`Error finding activity with id ${id}: ${err}`)
            res.status(400).json({ msg: `Error finding activity with id ${id}` })
        })

})


module.exports = router;