const dotenv = require('dotenv');
dotenv.config();


const MongoClient = require('mongodb').MongoClient;
const express = require("express");
const path = require('path');
const API_PORT = 8000;
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const activity = require('./activity');
const review = require('./review');
const login = require('./login')
const favourite = require('./favourite')



//MongoDB set up ans start server
//build url for config file info
const config = require('./config-db.js');
const url = `mongodb+srv://${config.username}:${config.password}@cluster0.uygwfic.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(url, { useUnifiedTopology: true });
let collection = null; // initially null 
let collectionLogin = null;

app.use(express.static(path.join(__dirname, '../client')));


//creates a collection
const createCollection = async function () {
    return client.db().createCollection(config.collection)
        .then(() => {
            collection = client.db().collection(config.collection); //initialise our global variable so it can be used later
            console.log("Collection created!");
        })
        .catch(err => {
            console.log("Could not create collection ", err.message);
            //we will can check the reason the creation failed - 48 means collection already exists
            //in this case, we are choosing to re-throw the error if the collection does *not* already exist 
            if (err.name != 'MongoError' || err.code !== 48) throw err;
        })
}


//Insert some data for  activities 
const insertOneStarterData = async function () {
    return collection.insertMany([
        // { _id: "1", name: 'St Andrews West Sands Beach', images: ["https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", "https://images.pexels.com/photos/635279/pexels-photo-635279.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"], about: "", location: "West Sands", reviews: [{ userName: "Cath", comment: "Love the Sunset", rating: "4" }, { userName: "Rambo", comment: "The weather is too cold, but was fun", rating: "3" }], type: 'Beaches', cost: "20", LAT: "56.35622", LON: "-2.80834" },
        // { _id: "2", name: 'St Andrews Cathedral', images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/St_Andrews_cathedral_and_St_Rules_Tower.jpg/1200px-St_Andrews_cathedral_and_St_Rules_Tower.jpg"], about: "", location: "The Pends, St Andrews KY16 9QL", reviews: [{ userName: "Calvin", comment: "The Ancient stuff!, wow.", rating: "4" }, { userName: "Dasey", comment: "Best for short visit", rating: "3" }], type: 'Historic Sites', cost: "20", LAT: "56.33963", LON: "-2.78847" }])

        {
            _id: "1", activityName: 'St Andrews West Sands Beach', lat: 56.35622, long: -2.80834, location: "West Sands",
            age: "5+", type: 'Beaches', price: "20",
            decription: "", images: ["https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", "https://images.pexels.com/photos/635279/pexels-photo-635279.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"],
            reviews: [{ userName: "Cath", comment: "Love the Sunset", rating: "4" }, { userName: "Rambo", comment: "The weather is too cold, but was fun", rating: "3" }]
        },

        {
            _id: "2", activityName: 'St Andrews Cathedral', lat: 56.33963, long: -2.78847, location: "The Pends, St Andrews KY16 9QL",
            age: "5+", type: 'Historic Sites', price: "20",
            decription: "", images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/St_Andrews_cathedral_and_St_Rules_Tower.jpg/1200px-St_Andrews_cathedral_and_St_Rules_Tower.jpg"],
            reviews: [{ userName: "Calvin", comment: "The Ancient stuff!, wow.", rating: "4" }, { userName: "Dasey", comment: "Best for short visit", rating: "3" }]
        },
        {

            _id: "3", activityName: 'Tower of London', lat: 51.50853, long: -0.07613, location: "London",

            age: "10+", type: 'Historic Sites', price: "30",

            decription: "Famous Tower of London where lots of royals died", images: ["https://upload.wikimedia.org/wikipedia/commons/5/5a/La_Torre%2C_Londres%2C_Inglaterra%2C_2014-08-11%2C_DD_071.JPG", "https://upload.wikimedia.org/wikipedia/commons/e/ec/Tower_of_London_from_the_Shard_%288515883950%29.jpg", "https://upload.wikimedia.org/wikipedia/commons/1/1e/Whitetowerlondon.jpg"],

            reviews: [{ userName: "Calvin", comment: "so cool, wow.", rating: "1" }, { userName: "Tim", comment: "Best for short visit", rating: "3" }]

        },

        {

            _id: "4", activityName: 'Edinburgh Castle', lat: 55.94861, long: -3.20083, location: "Edinburgh",

            age: "20+", type: 'Historic Sites', price: "10",

            decription: "Castle", images: ["https://upload.wikimedia.org/wikipedia/commons/7/72/Scotland-2016-Aerial-Edinburgh_Castle_%28cropped%29.jpg", "https://upload.wikimedia.org/wikipedia/commons/2/26/Edinburgh_Castle_from_the_North.JPG", "https://upload.wikimedia.org/wikipedia/commons/e/ef/Edinburgh_Castle_Rock.jpg"],

            reviews: [{ userName: "Calvin", comment: "so cool, wow.", rating: "1" }, { userName: "Tim", comment: "Best for short visit", rating: "3" }]



        },

        {

            _id: "5", activityName: 'Birdwatching', lat: 56.35910, long: -2.89052, location: "Guardbridge",



            age: "60+", type: 'Outdoors', price: "0",

            decription: "Cool birds in Guardbridge", images: ["https://upload.wikimedia.org/wikipedia/commons/0/07/Foto_Marcelo_Sirkis_3_%2849574785843%29.jpg", "https://upload.wikimedia.org/wikipedia/commons/b/b6/Pica_pica_-_Compans_Caffarelli_-_2012-03-16.jpg", "https://upload.wikimedia.org/wikipedia/commons/3/3b/Blauelester_donana.jpg"],

            reviews: []

        },



        {

            _id: "6", activityName: 'Primark', lat: 56.46010, long: -2.97111, location: "Dundee",



            age: "10+", type: 'Shopping', price: "20",



            decription: "Can't get enough cheap clothes", images: ["https://upload.wikimedia.org/wikipedia/commons/3/31/Penney%27s%2C_Mary_Street%2C_Dublin.jpg", "https://upload.wikimedia.org/wikipedia/commons/8/8b/Edificio_Madrid-Par%C3%ADs_%28Madrid%29_08.jpg", "https://upload.wikimedia.org/wikipedia/commons/a/a4/Interior_of_the_Ridings_Centre%2C_Wakefield%2C_West_Yorkshire_%288th_December_2020%29_004.jpg"],



            reviews: [{ userName: "Lauren", comment: "Can't stop shopping here", rating: "5" }]



        },

        {

            _id: "22", activityName: 'Nightclubbing', lat: 38.90699, long: 1.42142, location: "Ibiza",

            age: "20+", type: 'Nightlife', price: "100",

            decription: "", images: ["https://upload.wikimedia.org/wikipedia/commons/3/32/Wikipedia_space_ibiza%2803%29.jpg", "https://upload.wikimedia.org/wikipedia/commons/9/9d/ForbysIbizaTown_03.jpg", "https://upload.wikimedia.org/wikipedia/commons/7/79/0.1._Port_d%27Eivissa_%28Piti%C3%BCses%29.jpg"],

            reviews: [{ userName: "Tim", comment: "party time", rating: "5" }]



        },

        {

            _id: "7", activityName: 'Machu Picchu', lat: -13.16307, long: -72.54512, location: "Peru",

            age: "20+", type: 'Outdoors', price: "0",

            decription: "", images: ["https://upload.wikimedia.org/wikipedia/commons/1/13/Before_Machu_Picchu.jpg", "https://upload.wikimedia.org/wikipedia/commons/0/09/Machu_Picchu_%283833992683%29.jpg", "https://upload.wikimedia.org/wikipedia/commons/5/59/Machupicchu_intihuatana.JPG"],

            reviews: [{ userName: "Bill", comment: "bucket list", rating: "5" }]

        },

        {

            _id: "8", activityName: 'Hiking', lat: 46.87997, long: -121.72691, location: "Seattle",

            age: "30+", type: 'Outdoors', price: "0",

            decription: "", images: ["https://upload.wikimedia.org/wikipedia/commons/c/c4/Mount_Rainier_from_30%2C000_feet.jpg", "https://upload.wikimedia.org/wikipedia/commons/e/eb/Mount_Rainier_from_west.jpg", "https://upload.wikimedia.org/wikipedia/commons/b/b0/Mt._Rainier_seen_from_Bainbridge_Island.jpg"],

            reviews: [{ userName: "Lauren", comment: "primo hiking", rating: "4" }]

        },

        {

            _id: "9", activityName: 'Cromars Fish and Chips', lat: 56.33871, long: -2.79902, location: "St Andrews",

            age: "10+", type: 'Dining', price: "20",



            decription: "Overpriced fish and chips", images: ["https://upload.wikimedia.org/wikipedia/commons/f/ff/Fish_and_chips_blackpool.jpg", "https://upload.wikimedia.org/wikipedia/commons/7/76/Fish_and_chips.jpg", "https://upload.wikimedia.org/wikipedia/commons/9/99/Mobile_Fish_and_Chips.JPG"],

            reviews: [{ userName: "Calvin", comment: "so cool, wow.", rating: "1" }, { userName: "Tim", comment: "Best for short visit", rating: "3" }]







        },


        {

            _id: "10", activityName: 'Scottish Deer Centre', lat: 56.34042, long: 3.08691, location: "Cupar",

            age: "5+", type: 'Educational', price: "50",

            decription: "Deer experience", images: ["https://upload.wikimedia.org/wikipedia/commons/6/62/Chital_%288458215435%29.jpg", "https://upload.wikimedia.org/wikipedia/commons/f/fb/Hydropotes_inermis_male.JPG", "https://upload.wikimedia.org/wikipedia/commons/7/70/Gorani_%28Korean_water_deer%29_%28Hydropotes_inermis%29.jpg"],

            reviews: []

        },

        {

            _id: "11", activityName: 'St Andrews School of Computer Science', lat: 56.33995, long: 2.80954, location: "St Andrews",

            age: "10+", type: 'Educational', price: "0",

            decription: "Jack Cole Building", images: [],

            reviews: []

        },



        {

            _id: "12", activityName: 'St Andrews Old Course', lat: 56.32174, long: -2.81615, location: "St Andrews",



            age: "50+", type: 'Sporting', price: "200",



            decription: "Golf", images: ["https://upload.wikimedia.org/wikipedia/commons/1/13/Swilken_Bridge%2C_Old_Course_geograph-6310525-by-Gordon-Hatton.jpg", "https://upload.wikimedia.org/wikipedia/commons/6/6e/Golfer_swing.jpg", "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tammer-Golf.jpg"],



            reviews: [{ userName: "Calvin", comment: "expensive", rating: "1" }, { userName: "Tim", comment: "Green", rating: "3" }]



        },

        {

            _id: "13", activityName: 'St Andrews Aquarium', lat: 56.34367, long: -2.80000, location: "St Andrews",



            age: "5+", type: 'Educational', price: "30",



            decription: "Aquarium in St Andrews", images: ["https://upload.wikimedia.org/wikipedia/commons/9/94/Underwater_Walk_of_Sea_Life_London_Aquarium.jpg", "https://upload.wikimedia.org/wikipedia/commons/4/4b/Lisbon_Oceanarium.jpg", "https://upload.wikimedia.org/wikipedia/commons/a/a8/Amaterske_akvarium.jpg"],

            reviews: [{ userName: "Pamela", comment: "love penguins", rating: "1" }, { userName: "Tim", comment: "Best for short visit", rating: "3" }]



        },

        {

            _id: "14", activityName: 'Old Course Hotel', lat: 56.34475, long: -2.81167, location: "St Andrews",



            age: "60+", type: 'Hotel', price: "200",



            decription: "Expensive hotel", images: ["https://upload.wikimedia.org/wikipedia/commons/4/47/Old_Course_Hotel-St_Andrews-Geograph-6167264-by-Richard-Sutcliffe_%28cropped%29.jpg", "https://upload.wikimedia.org/wikipedia/commons/0/07/Hotel-suite-living-room.jpg", "https://upload.wikimedia.org/wikipedia/commons/3/36/Old_Course_Hotel_-_geograph.org.uk_-_394910.jpg"],

            reviews: []

        },

        {

            _id: "15", activityName: 'St Andrews Museum', lat: 56.33371, long: -2.81026, location: "St Andrews",



            age: "10+", type: 'Museum', price: "20",

            decription: "", images: ["https://upload.wikimedia.org/wikipedia/commons/3/33/St_Andrews_museum_-_geograph.org.uk_-_423565.jpg", "https://upload.wikimedia.org/wikipedia/commons/4/4e/NDM_Activity_-_Guided_tour.JPG", "https://upload.wikimedia.org/wikipedia/commons/d/dc/Dresden_-_Japanese_tourist_with_baby_-_1786.jpg"],



            reviews: [{ userName: "Lauren", comment: "Never open", rating: "2" }]



        },

        {

            _id: "16", activityName: 'Student Union', lat: 56.34077, long: -2.80015, location: "St Andrews",

            age: "20+", type: 'Shopping', price: "20",

            decription: "", images: ["https://upload.wikimedia.org/wikipedia/commons/3/3a/University_Shop_and_Rector%27s_Cafe%2C_Market_Street%2C_St_Andrews_geograph-6109914-by-Richard-Sutcliffe.jpg", "https://upload.wikimedia.org/wikipedia/commons/e/e4/Latte_and_dark_coffee.jpg", "https://upload.wikimedia.org/wikipedia/commons/3/3e/University_buildings_-_geograph.org.uk_-_586036.jpg"],

            reviews: [{ userName: "Tim", comment: "nice cafe", rating: "5" }]

        },

        {

            _id: "17", activityName: 'Guardbridge Inn', lat: 56.35912, long: -2.88742, location: "Guardbridge",

            age: "40+", type: 'Hotel', price: "100",

            decription: "", images: ["https://upload.wikimedia.org/wikipedia/commons/4/44/Guardbridge.jpg", "https://upload.wikimedia.org/wikipedia/commons/0/07/Hotel-suite-living-room.jpg", "https://upload.wikimedia.org/wikipedia/commons/e/e4/Latte_and_dark_coffee.jpg"],

            reviews: [{ userName: "Bill", comment: "bucket list", rating: "5" }]

        },

        {

            _id: "18", activityName: 'Waverley Station', lat: 55.95181, long: -3.18523, location: "Edinburgh",



            age: "50+", type: 'Travel', price: "0",



            decription: "Trains", images: ["https://upload.wikimedia.org/wikipedia/commons/1/1a/Edinburgh_Waverley_from_the_east%2C_2016.jpg", "https://upload.wikimedia.org/wikipedia/commons/2/26/Edinburgh_Castle_from_the_North.JPG", "https://upload.wikimedia.org/wikipedia/commons/e/ef/Edinburgh_Castle_Rock.jpg"],



            reviews: [{ userName: "Calvin", comment: "crowded", rating: "1" }]



        },

        {

            _id: "19", activityName: 'Christmas Market', lat: 55.95528, long: -3.18222, location: "Edinburgh",



            age: "5+", type: 'Shopping', price: "100",



            decription: "Christmas market", images: ["https://upload.wikimedia.org/wikipedia/commons/1/12/Wien_-_Christkindlmarkt%2C_Rathausplatz.JPG", "https://upload.wikimedia.org/wikipedia/commons/2/26/Edinburgh_Castle_from_the_North.JPG", "https://upload.wikimedia.org/wikipedia/commons/e/ef/Edinburgh_Castle_Rock.jpg"],

            reviews: [{ userName: "Pamela", comment: "love penguins", rating: "1" }, { userName: "Tim", comment: "Best for short visit", rating: "3" }]



        },

        {

            _id: "20", activityName: 'Princes Mall', lat: 55.95166, long: -3.18833, location: "Edinburgh",

            age: "20+", type: 'Shopping', price: "50",

            decription: "Shopping", images: ["https://upload.wikimedia.org/wikipedia/commons/b/ba/9.3.07GardenStatePlazaMallbyLuigiNovi.JPG", "https://upload.wikimedia.org/wikipedia/commons/2/26/Edinburgh_Castle_from_the_North.JPG", "https://upload.wikimedia.org/wikipedia/commons/e/ef/Edinburgh_Castle_Rock.jpg"],

            reviews: [{ userName: "Pamela", comment: "love shopping", rating: "1" }, { userName: "Tim", comment: "good mall", rating: "3" }]

        },

        {

            _id: "21", activityName: 'Royal Mile', lat: 55.95056, long: -3.18556, location: "Edinburgh",



            age: "10+", type: 'Outdoors', price: "20",

            decription: "", images: ["https://upload.wikimedia.org/wikipedia/commons/8/8d/High_Street%2C_Edinburgh.JPG", "https://upload.wikimedia.org/wikipedia/commons/2/26/Edinburgh_Castle_from_the_North.JPG", "https://upload.wikimedia.org/wikipedia/commons/e/ef/Edinburgh_Castle_Rock.jpg"],



            reviews: [{ userName: "Lauren", comment: "Love it here", rating: "5" }]

        }






    ])

        .then(res => console.log("data inserted with ID", res.insertedIds))
        .catch(err => {
            console.log("Could not add data ", err.message);
            //For now, ingore duplicate entry errors, otherwise re-throw the error for the next catch
            if (err.name != 'MongoBulkWriteError' || err.code != 11000) throw err;
        })
}


//Find data from database based on query
const findMany = async function (query) {
    return collection.find(query).toArray()
        .catch(err => {
            console.log("Could not find ", query, err.message);
        })
}


//connect to database
client.connect()
    .then(
        connection => {
            //if collection is not present it is automatically created 
            collection = client.db().collection(config.collection); //comment this when createCollection() is uncommented
            collectionLogin = client.db().collection("login");
            collectionFavourites = client.db().collection("favourite")
            console.log("Server: Connected to Database");
        }
    )
    .catch(err => {
        console.log(`Error in connecting to Database ${url.replace(/:([^:@]{1,})@/, ':****@')}`, err);
    })
    //  .then(() => client.db().collection(config.collection).drop()) //drop the collection if it exists
    //.then(() => createCollection()) // invoke createCollection if not created 
   // .then(() => insertOneStarterData()) //invoke insert data for loading initial data
    // .then(() => insertOneStarterDataFavourites())
    //
    //  .then(() => findMany({ LAT: "56.33963344069176" }))
    //  .then(docs => console.log("found docs", docs))
    // .catch(err => { console.log("Giving up!", err.message); })
    // .finally(() => {
    //     client.close();
    //     console.log("Disconnected");
    // });
    .then(() => {
        app.listen(API_PORT);
        console.log("Server Started in port:" + API_PORT);
    })
    .catch(err => console.log(`Could not start server`, err))
//.finally(()=>{client.close(); console.log("Disconnected");})


//Set up 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'images'));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });
//API to upload image
app.post('/uploadImage', upload.single("file"), function (request, response) { //file is the name to be used in post data for file
    console.log(request.file);
    //const file  = request.file;
    const imagePath = path.join(request.file.path);
    response.status(200).send(imagePath);
});

app.use('/activity', activity);
app.use('/favourite', favourite);
app.use('/review', review);
app.use('/user', login);