var searchResultsArray = [];


// var favourite =  { _id: "yash@gmail.com", favourite: [ {
//     _id: "1", activityName: 'St Andrews West Sands Beach', lat: 56.35622, long: -2.80834, location: "West Sands",
//     age: "5+", type: 'Beaches', price: "20",
//     decription: "", images: ["https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", "https://images.pexels.com/photos/635279/pexels-photo-635279.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"],
//     reviews: [{ userName: "Cath", comment: "Love the Sunset", rating: "4" }, { userName: "Rambo", comment: "The weather is too cold, but was fun", rating: "3" }]
// }, {
//     _id: "2", activityName: 'St Andrews Cathedral', lat: 56.33963, long: -2.78847, location: "The Pends, St Andrews KY16 9QL",
//     age: "5+", type: 'Historic Sites', price: "20",
//     decription: "", images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/St_Andrews_cathedral_and_St_Rules_Tower.jpg/1200px-St_Andrews_cathedral_and_St_Rules_Tower.jpg"],
//     reviews: [{ userName: "Calvin", comment: "The Ancient stuff!, wow.", rating: "4" }, { userName: "Dasey", comment: "Best for short visit", rating: "3" }]
// }] };

var userEmailLogged;
window.onload = function () {
    var params = new URLSearchParams(window.location.search);
//   var userName = params.get("userName");
  var userEmail = params.get("userEmail");

 var favlink = `http://localhost:8000/favoriteslist.html?userEmail=`+encodeURIComponent( userEmail);

    console.log(favlink);
    document.getElementById("favourites").href = favlink;

 userEmailLogged = userEmail;
 getSearchResults()

}

var results = [];
async function getSearchResults() {
    let response = await fetch(`http://localhost:8000/favourite/${userEmailLogged}`,{method:"GET"})
    let searchResults = await response.json()
    console.log("Search results retrieved");
    console.log(searchResults.favourite[0].favourite)
    
    results = searchResults.favourite[0].favourite;
    // let results = searchResults.favourite[0].favourite;
    // console.log(results[0].favourite)
    // results.forEach(element => {
    //     console.log(element)
    // });
//displayResult(results);
document.getElementById("displayFav").innerHTML ="";
results.forEach(element => {
    console.log(element);
    
    document.getElementById("displayFav").innerHTML = document.getElementById("displayFav").innerHTML+"<div class='col-xs-5 col-sm-5 col-md-5 col-lg-5 mt-5 m-auto'>" +
    "<div class='card-body row bg-secondary rounded-5 text-white ' id='favourites' '>"+
    
       " <div class='col-xs-6 col-sm-6 col-md-6 col-lg-6 my-3'>"+
       "<h2 class='activityName ' id='activityName'> "+ element.activityName+" </h2>"+
            "<p class='lead' id='location'>"+ element.location+"</p>"+
            "<p class='fw-bold' id='age'>"+ element.age+"</p>"+
            "<p class='fw-bold' id='type'>"+ element.type+"</p>"+
            "<p class='fw-bold' id='price'> $"+ element.price+"</p>"+
           " <button class='btn btn-warning ' onclick='redirectTOAbout(\""+ element.activityName+"\")'> Details </button>"+
           " <button class='btn btn-light' onclick='deleteFav(\""+ element.activityName+"\")'> Remove </button>"+
       " </div>"+

       " <div class='col-xs-6 col-sm-6 col-md-6 col-lg-6 text-start my-3'>"+

            "<img src="+ element.images[0]+" class='img-responsive activity-Image rounded-5' alt='Activity Image' >"

        "</div>"+


    "</div>"+
"</div>"

});
}

// results = favourite.favourite;

function redirectTOAbout(activityName) {

    console.log(activityName);
    let dataForSelectedAtivity;
    results.forEach(element=>{
        if(element.activityName == activityName){
            dataForSelectedAtivity = element;
        }
    });
    console.log(dataForSelectedAtivity)
    localStorage.setItem("selectedActivity", JSON.stringify(dataForSelectedAtivity));
    const localStoragedata = JSON.parse(localStorage.getItem("selectedActivity"));
    console.log("localStoragedata"+localStoragedata);
    window.location.href= "http://localhost:8000/activitydetail.html"
}

async function deleteFav(activityName) {
    console.log(activityName)

    deleteBody={
        userEmail :userEmailLogged,
        activityName:activityName
    }

    const request =   await fetch('http://localhost:8000/favourite/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deleteBody)
    });
    // let response = await fetch(`http://localhost:8000/favourite/delete`,{ method: "DELETE", body: { userEmail: "yash@gmail.com", activityName: activityName } })
    let searchResults = await request.json()
    console.log("delete results retrieved"+searchResults);
    // document.getElementById("displayFav").innerHTML ="";
    getSearchResults()

}


// console.log(results);

//console.log(searchResultsArray);