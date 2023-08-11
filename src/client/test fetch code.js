/* 
* add activity
* @path: /activity/add
* @body: {json}: activity: activity json
* compulsary data strcuture will be validated in the server
* @return: {json}: {msg: "Added"} or {msg: "could not add"}
*/
var newActivity = {
    activityName: 'park',
    location: 'st andrews',
    lat: 10, //Float !!
    long: 66, //Float !!
    age: '8-12',
    type: 'relax',
    price: '$$',
    description: "description",
    images:[],
    reviews: [],
}

fetch('/activity/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newActivity)
})
    .then(res => res.text())
    .then(txt => alert(txt))
    .catch(err => console.log(err))



/* 
* get activity
* @path: /activity/get
* @return: {json} or {msg: "could not find"}
*/
fetch(`/activity/get`, {
    method: 'GET',
})
    .then(res => res.text())
    .then(txt => console.log(txt))
    .catch(err => console.log(err))


//delete activity

var id = ""
fetch(`/activity/delete/${id}`, {
    method: 'delete',
})
    .then(res => res.text())
    .then(txt => alert(txt))
    .catch(err => console.log(err))


//fetch single activity with id
var id = "5"

fetch(`activity/get/${id}`,{
  method:"GET"
})
.then(res => res.text())
    .then(txt => console.log(txt))
    .catch(err => console.log(err))


/* 
* add review
* @path: /review/add/${activityId}
* @body: {json}: newReview: {user: user, comment: comment, ranting: ranting}
* @return: {json}: {msg: msg}
*/
var id = "6428806668d56c3538682348"
var newReview = { user: "xz75", comment: "Good", ranting: "5" }

fetch(`/review/add/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newReview)
})
    .then(res => res.text())
    .then(txt => alert(txt))
    .catch(err => console.log(err))

//delete review




// 
/* 
* login
* @path: /user/login
* @body: {json}: loginData: {userEmail: userEmail, password: password}
* @return: {json}: {msg: msg}
*/
var userEmail = "test@gmail.com";
var password = "testh@123";
var loginData = { userEmail: userEmail, password: password };

fetch(`/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loginData)
})
    .then(res => res.text())
    .then(txt => alert(txt))
    .catch(err => console.log(err))


/* 
* register
* @path: /user/register
* @body: {json}: registerData: {userEmail: userEmail, password: password, userName: userName}
* @return: {json}: {msg: msg}
*/
var userEmail = "test@st-andrews.ac.uk";
var password = "test@456";
var userName = "testUser"
var registerData = { userEmail: userEmail, password: password };

fetch(`/user/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registerData)
})
    .then(res => res.text())
    .then(txt => alert(txt))
    .catch(err => console.log(err))

/* 
* add favourite activity
*
*/
var userEmail = "yash@gmail.com";
var activityName = "St Andrews Cathedral";
var favouriteData = { userEmail: userEmail, activityName: activityName };

fetch(`/favourite/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(favouriteData)
})
    .then(res => res.text())
    .then(txt => alert(txt))
    .catch(err => console.log(err))



fetch(`/favourite/${userEmail}`, {
    method: 'GET',
})
    .then(res => res.text())
    .then(txt => alert(txt))
    .catch(err => console.log(err))