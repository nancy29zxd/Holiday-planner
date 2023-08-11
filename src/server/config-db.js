(function () {
    const db_info = {
        url: 'localhost',
        username: process.env.MONGODB_USERNAME,
        password: process.env.MONGODB_PASSWORD,
        database: 'TripPlanner', //TripPlanner2 - FINAL DB
        collection: 'Events'
    };

    const moduleExports = db_info;

    if (typeof __dirname != 'undefined')
        module.exports = moduleExports;
}());