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

client.connect()
    .then(
        connection => {
            //if collection is not present it is automatically created 
            collection = client.db().collection(config.collection); //comment this when createCollection() is uncommented
            console.log("Reviews: Connected to Database");
        }
    )
    .catch(err => {
        console.log(`Error in connecting to Database ${url.replace(/:([^:@]{1,})@/, ':****@')}`, err);
    })




function validateView(json) {

}


/* 
update activity-add comments 
@path: /activity/add-comment/:activityId
@params：{string}:activityId: activity id
@body: {json}: view: view json, assuming follow the data structure that Yash inserted
*/
//https://stackoverflow.com/questions/8233014/how-do-i-search-for-an-object-by-its-objectid-in-the-mongo-console
router.post('/add/:ID', function (req, res) {
    const id = req.params.ID;
    const userName = req.body.userName;
    const comment = req.body.userComment;
    const rating = req.body.userRating;
    const newReview = { userName: userName, comment: comment, rating: rating };
    
    const isMongoId = ObjectId.isValid(id);
    if (isMongoId){
        var mongoId =  new ObjectId(id)
    }else {
        var mongoId = id
    }

    // var mongoId = new ObjectId(id)
    collection.findOne({ _id: mongoId })
        .then(doc => {
            //could not find the activity
            if (doc == null) {
                res.status(404).json({ msg: `Activity with ID ${mongoId} not found` })
            } else {
                console.log(doc)
                // res.status(200).json(doc)
                // sucessfully find the activity, push to activity
                //https://www.mongodb.com/docs/manual/reference/operator/update/push/#mongodb-update-up.-push
                collection.updateOne({ _id: mongoId }, { $push: { reviews: newReview } })
                    .then(() => {
                        res.status(200).json({ msg: `Added comment to activity with ID ${mongoId}` })
                    })
                    //could not add view
                    .catch(err => {
                        console.log(err)
                        res.status(400).json({ msg: `Could not add comment to activity with ID ${mongoId}` })
                    })

            }
        });

})


// delete comments
// router.delete('/delete/:ID', function (req, res) {
//     var id = req.params.ID;
//     collection.findOne({ _id: new ObjectId(id) })
//         .then(doc => {
//             //could not find the activity
//             if (doc == null) {
//                 res.status(404).json({ msg: `Activity ${id} not found` })
//             } else {
//                 console.log(doc)
                // res.status(200).json(doc)
                // find the activity, update views
    //             collection.updateOne({ _id: new ObjectId(id) }, { $push: { views: newView } })
    //                 .then(() => {
    //                     res.status(200).json({ msg: `Deleted comment to activity ${id}` })
    //                 })
    //                 //could not delete
    //                 .catch(err => {
    //                     console.log(err)
    //                     res.status(400).json({ msg: `Could not delete comment of activity ${id}` })
    //                 })

        //     }
        // });

// });

module.exports = router;