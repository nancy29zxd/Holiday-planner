// const objects = [
//   {
//     _id: "1", activityName: 'St Andrews West Sands Beach', lat: 56.35622, long: -2.80834, location: "West Sands",
//     age: "5+", type: 'Beaches', price: "20",
//     decription: "", images: ["https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", "https://images.pexels.com/photos/635279/pexels-photo-635279.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"],
//     reviews: [{ userName: "Cath", comment: "Love the Sunset", rating: "4" }, { userName: "Rambo", comment: "The weather is too cold, but was fun", rating: "3" }]
//   },

//   {
//     _id: "2", activityName: 'St Andrews Cathedral', lat: 56.33963, long: -2.78847, location: "The Pends, St Andrews KY16 9QL",
//     age: "5+", type: 'Historic Sites', price: "20",
//     decription: "", images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/St_Andrews_cathedral_and_St_Rules_Tower.jpg/1200px-St_Andrews_cathedral_and_St_Rules_Tower.jpg"],
//     reviews: [{ userName: "Calvin", comment: "The Ancient stuff!, wow.", rating: "4" }, { userName: "Dasey", comment: "Best for short visit", rating: "3" }]
//   },
//   {
//     _id: '3',
//     activityName: 'Test',
//     lat: 30,
//     long: -3.78847,
//     location: "St Andrews",
//     age: '5+',
//     type: 'Historic Sites',
//     price: '20',
//     decription: '',
//     images: [
//       'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/St_Andrews_cathedral_and_St_Rules_Tower.jpg/1200px-St_Andrews_cathedral_and_St_Rules_Tower.jpg'],
//     reviews: []
//   }
// ]

//Student 220014528's code 
// get search results from server, which was stored in local storage
var results;
var filteredObjects;

const params = new URLSearchParams(window.location.search);
const value1 = params.get('LAT');

console.log(value1 + params.get('LONG'))

window.onload = async function () {

  try {
    const response = await fetch("http://localhost:8000/activity/search", 
    { method: "POST" ,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(
            {
                LAT: params.get('LAT'),
                LONG: params.get('LONG'),
                distance:params.get('dist')
            })
    });
    const responseData = await response.json();
    console.log(responseData);

results = responseData
  } catch (error) {
    results = JSON.parse(localStorage.getItem("myData"));
  }

  
//   var userName = params.get("userName");
  var userEmail = params.get("userEmail");

 var favlink = `http://localhost:8000/favoriteslist.html?userEmail=`+encodeURIComponent(userEmail);

    console.log(favlink);
    document.getElementById("favourites").href = favlink;
  
 
  console.log(results);
  populateSearchResults(results)
  populateSelectMenus(results)
  favourBtnEvent()
  DetailBtnEvent()
  filteredObjects = results;
  console.log(filteredObjects);
}


// https://getbootstrap.com/docs/5.0/components/card/
function populateSearchResults(objects) {

  //This function will populate the main page with the information from the server
  for (let i = 0; i < objects.length; i++) {
    var divRow = document.getElementById("searchresults")
    // divRow.appendChild(activityCards);
    divRow.innerHTML += '<div class="col-sm-4 col-md-4 col-lg-4 mb-3">'+
    `
    <div id="${objects[i].activityName}-card" class="card" style="width: 18rem" style="cursor: pointer">
      <img src="${objects[i].images[0]}" class="card-img-top" style="width: 100%; object-fit: cover;height:200px;">
      <div class="card-body">
        <h5 class="card-title">${objects[i].activityName}</h5>
        <p class="card-text">Location: ${objects[i].location}</p>
        <div class="row">
        <div class="col-sm-5 col-lg-5 col-md-5">
        <button id='${objects[i].activityName}-detail-btn' class="btn btn-warning detail-btn">View Detail</button>
        
        </div>
        <div class="col-sm-7 col-lg-7 col-md-7">
        <button id='${objects[i].activityName}-favour-btn' class="btn btn-secondary favour-btn" >Add to Favourites</button>
        
        </div>
        </div>
      </div>
    </div></div>`

  }
}

function favourBtnEvent(){
  var favourBtn = document.getElementsByClassName("favour-btn");
      //console.log(favourBtn)
      for (let i = 0; i < favourBtn.length; i++) {
        favourBtn[i].addEventListener("click", function(){
          var activityName = this.id.split("-")[0];
          console.log(activityName);
          addToFavourite(activityName);

      })
  }
}

async function addToFavourite(actvityName){
  // userEmail = localStorage.getItem("userEmail");

  var params = new URLSearchParams(window.location.search);

  var userEmail = params.get("userEmail");


  userEmail = userEmail;
  
  const response = await  fetch (`/favourite/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({userEmail: userEmail, activityName: actvityName})
  });
  const responseMsg = await response.json()
  console.log(responseMsg);
  window.alert(responseMsg.message);
}



function DetailBtnEvent(){
  var detailBtn = document.getElementsByClassName("detail-btn");
      console.log( detailBtn)
      for (let i = 0; i <  detailBtn.length; i++) {
        detailBtn[i].addEventListener("click", function(){
          var activityName = this.id.split("-")[0];
          console.log(activityName)
          
          var selectedData = findSeletedActivity(results, activityName)
          console.log(selectedData);

          localStorage.setItem("selectedActivity", JSON.stringify(selectedData));
          // const localStoragedata = JSON.parse(localStorage.getItem("selectedActivity"));
          // console.log(localStoragedata);
          var params = new URLSearchParams(window.location.search);
          var userName = params.get("userName");
          var userEmail = params.get("userEmail");
        
          const hiddenParams = {
            userName: userName,
            userEmail: userEmail,
          };
        

          window.location.href = `http://localhost:8000/activitydetail.html?`+new URLSearchParams(hiddenParams);
      })
  }
}


function findSeletedActivity(json, activityName){
  var selectedActivity = json.find(item => item.activityName === activityName);
  return selectedActivity ? selectedActivity : null;
}





//Student 220018588 and 210033710's code
  // var filteredObjects = objects;
  // console.log(filteredObjects);

var filters = {
  location: null,
  age: null,
  type: null,
  price: null
};

function filterLocation(){
  console.log("filtering location");
  filters.location = document.getElementById("locationSelector").value;
  console.log(filters.location)
  applyFilters();
}

function filterAge(){
  console.log("filtering age");
  filters.age = document.getElementById("ageSelector").value;
  applyFilters();
}

function filterType(){
  console.log("filtering type");
  filters.type = document.getElementById("typeSelector").value;
  applyFilters();
}

function filterPrice(){
  console.log("filtering price");
  filters.price = document.getElementById("priceSelector").value;
  applyFilters();
}


function applyFilters() {
  console.log(filteredObjects);

  // remove all cards
  // var results = document.getElementById("results");
  // results.innerHTML = "";

  // add only the cards that match all the filter conditions
  var newFilteredResults = [];

  for (let i = 0; i < filteredObjects.length; i++) {
    if(
      (filters.location && filteredObjects[i].location != filters.location) ||
        (filters.age && filteredObjects[i].age != filters.age) ||
        (filters.type && filteredObjects[i].type != filters.type) ||
        (filters.price && filteredObjects[i].price > filters.price)){

        //hide cards that do not meet the filter conditions
        var actvityName = filteredObjects[i].activityName
        // console.log(document.getElementById(`${actvityName}-card`))
        document.getElementById(`${actvityName}-card`).style.display = "none"
        
        
        // continue;
        }else{
          // add card to the filtered results
          newFilteredResults.push(filteredObjects[i]);
        }
 
  }
  populateSelectMenus(newFilteredResults)
  // filteredResults = newFilteredResults;
  // populateSearchResults(filteredResults);

}

  function resetFilter() {

    // reset the select boxes to be blank
    selectTags = document.getElementsByTagName("select");
    for (var i = 0; i < selectTags.length; i++) {
      selectTags[i].selectedIndex = 0;
    }

    // show all cards
    cards = document.getElementsByClassName("card");
    for(let i =0;i<cards.length;i++){
      // console.log(cards[i])
      cards[i].style.display = "";
    }

    filters = { location: null,age: null, type: null,price: null}

    populateSelectMenus(results)
    // reset the results so it displays everything

    // remove all the results
    // var results = document.getElementById("results");
    // results.innerHTML = "";

    // add all the results back
    // populateSearchResults(objects);

    }

    
// modified based on the students 210033710 and 220018588's code
function populateSelectMenus(objects) {
  var selectors = ["type","age","price","location"]
  var optionsArray = [];

  for (let i=0;i<selectors.length;i++){
    var selectorName = selectors[i];
    var selector = document.getElementById(`${selectorName}Selector`);

    // emtype and reset the selector options
    selector.innerHTML = '';

    //get the unique values
    for (let j=0; j < objects.length; j++) {
      //console.log(objects[j][selectorName])
      if (!optionsArray.includes(objects[j][selectorName])) {
        optionsArray.push(objects[j][selectorName]);
      }
    }

    // populate option array
    for (let y = 0; y <optionsArray.length; y++) {
      selector.innerHTML +=  `<option value="${optionsArray[y]}">${optionsArray[y]}</option>`
    }

    //empty the array
    optionsArray = [];





    // set the option value
    console.log(filters[selectorName])
    console.log(filters[selectorName] == null)
    // selector.value = filters[selector] == null ? `Select ${selector}` : filters[selector]

    if (filters[selector]==null){
      console.log(selector)
     // selector.value = `Select ${selectorName}`;
      console.log(`Select ${selectorName}`)
    }
    else{
    options.value = filters[selector]}
    
  }
}


  // Should be called by default?
  // populateSearchResults(objects);
  // populateSelectMenus(objects);

 //Student 210033710's code

// Assume response from the database query in the following format (List of objects)

// async function filterActivities(){
//     // get user search coordinates from upload.html page
//     let params = (new URL(document.location)).searchParams;
//     let lat= params.get("lat");
//     let lng = params.get("lng");

//     var results = null;

//     // make a get request to the /tourism endpoint to get the results within a ten mile radius
//     let requestUrl = "/tourism/" + lat + "/" + lng;
//     alert(requestUrl);

//     fetch(requestUrl)
//     .then((response) => {
//       console.log(response.status);
//       return response.json();
//     })
//     .then((results) => {
//       console.log("Search Results:")
//       console.log(results);

//         // display the results to the user
//         var resultsContainer = document.getElementById("Results");

//         const activityType = document.getElementById("activityType").value;
//         const age = parseInt(document.getElementById("age").value);
//         const price = parseInt(document.getElementById("price").value);

//         // note: modify to include price and age
//         results.forEach(function(activity) {
//             if(true){
//                 alert("YES");
//                 // Create the div element
//                 const resultImage = document.createElement('div');
//                 resultImage.classList.add('col-sm-3');

//                 // Create the anchor element
//                 const anchor = document.createElement('a');
//                 anchor.href = 'detail.html';

//                 // Create the image element
//                 const img = document.createElement('img');
//                 img.src = activity.images[0];
//                 img.classList.add('img-responsive');
//                 img.style.width = '100%';
//                 img.alt = 'Image';

//                 // Create the paragraph element
//                 const p = document.createElement('p');
//                 p.textContent = 'Result 1';

//                 // Append the image and paragraph elements to the anchor element
//                 anchor.appendChild(img);
//                 anchor.appendChild(p);

//                 // Append the anchor element to the div element
//                 resultImage.appendChild(anchor);

//                 resultsContainer.appendChild(resultImage);

//             }
//         });

//     });

//   }


//Student 220018588's code


// function populateSelectMenus(objects) {
  // var activityType = document.getElementById("activityType");
  // var activityAge = document.getElementById("activityAge");
  // var activityPrice = document.getElementById("activityPrice");
  // var activityLocation = document.getElementById("activityLocation");

  // var activityTypeArray = [];
  // var activityAgeArray = [];
  // var activityPriceArray = [];
  // var activityLocationArray = [];

  // var typeArray = [];
  // var ageArray = [];
  // var priceArray = [];
  // var locationArray = [];
//   for (let i = 0; i < objects.length; i++) {
//     if (!activityTypeArray.includes(objects[i].type)) {
//       activityTypeArray.push(objects[i].type);
//     }
//     if (!activityAgeArray.includes(objects[i].age)) {
//       activityAgeArray.push(objects[i].age);
//     }
//     if (!activityPriceArray.includes(objects[i].price)) {
//       activityPriceArray.push(objects[i].price);
//     }
//     if (!activityLocationArray.includes(objects[i].location)) {
//       activityLocationArray.push(objects[i].location);
//     }
//   }
//   for (let i = 0; i < activityTypeArray.length; i++) {
//     var option = document.createElement("option");
//     option.textContent = activityTypeArray[i];
//     option.value = activityTypeArray[i];
//     activityType.appendChild(option);
//   }
//   for (let i = 0; i < activityAgeArray.length; i++) {
//     var option = document.createElement("option");
//     option.textContent = activityAgeArray[i];
//     option.value = activityAgeArray[i];
//     activityAge.appendChild(option);
//   }
//   for (let i = 0; i < activityPriceArray.length; i++) {
//     var option = document.createElement("option");
//     option.textContent = activityPriceArray[i];
//     option.value = activityPriceArray[i];
//     activityPrice.appendChild(option);
//   }
//   for (let i = 0; i < activityLocationArray.length; i++) {
//     var option = document.createElement("option");
//     option.textContent = activityLocationArray[i];
//     option.value = activityLocationArray[i];
//     activityLocation.appendChild(option);
//   }
// }

// set up the googla map API
let map;
function initMap(){
  map = new google.maps.Map(document.getElementById("map"),{
        center: {lat: 56.339798, lng:-2.80834},
        zoom: 14,
        })

    // get the lat and long from the database
    fetch('/activity/get', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch activities.");
        }
      })
      .then((data) => {
        console.log("data is ", data)
        for (let i = 0; i < data.length; i++){
            let activityLAT = data[i].lat;
            let activityLONG = data[i].long;
            let activityName = data[i].activityName;
            let activityLanLng = new google.maps.LatLng(activityLAT, activityLONG);
            const contentString = data[i].activityName;
            placeMarkerAndPanTo(activityLanLng, map, activityName, contentString);


        }
        
      })
      .catch((error) => {
        console.log("Fetching error", error);
      });
}
//let currentPosition; // set a variable for current position

// showing lat & lng when clicking on the map
// bug: when clicking multiple places, the markers accummulated
function placeMarkerAndPanTo(latLng, map, activityName, contentString) {
    let marker = new google.maps.Marker({
      position: latLng,
      map: map,
      title: activityName
    });
    console.log("latLng is ", latLng)


    const infowindow = new google.maps.InfoWindow({
      content: contentString,
      ariaLabel: `activityName`,
    });

    marker.addListener("click", () => {
      infowindow.open({
      anchor: marker,
      map: map,
  });        
})


    // map.panTo(latLng);
    var selectedLatAndLng = {latitude: latLng.lat(), longitude: latLng.lng()}
    // console.log("this is the latitude from latLng", latLng.lat());
    // console.log("this is the longitude from latLng", latLng.lng());
    console.log(selectedLatAndLng)
    // const showedLatAndLng = document.getElementById("selectedLatAndLng-id");
    // document.getElementById("lat").value = selectedLatAndLng.latitude.toFixed(5);
    // document.getElementById("long").value =selectedLatAndLng.longitude.toFixed(5);
    // showedLatAndLng.innerHTML = "You have selected " + selectedLatAndLng.latitude + ", " + selectedLatAndLng.longitude;
    return latLng;
}

/*   var selectedLocation = document.getElementById("activityLocation").value;
  var activityCards = document.querySelectorAll(".activityCard");
  for (let i = 0; i < activityCards.length; i++) {
    var activityCard = activityCards[i];
    var location = activityCard.dataset.location;
    if (location == selectedLocation) {
      activityCard.style.display = "block";
    } else {
      activityCard.style.display = "none";
    }
  } */

/*   var selectedPrice = document.getElementById("activityPrice").value;
  var activityCards = document.querySelectorAll(".activityCard");
  for (let i = 0; i < activityCards.length; i++) {
    var activityCard = activityCards[i];
    var price = activityCard.dataset.price;
    if (price <= selectedPrice) {
      activityCard.style.display = "block";
    } else {
      activityCard.style.display = "none";
    }
  } */

/*   var selectedType = document.getElementById("activityType").value;
var activityCards = document.querySelectorAll(".activityCard");
for (let i = 0; i < activityCards.length; i++) {
  var activityCard = activityCards[i];
  var type = activityCard.dataset.type;
  if (type == selectedType) {
    activityCard.style.display = "block";
  } else {
    activityCard.style.display = "none";
  }
} */

  //  var selectedAge = document.getElementById("activityAge").value;
  // var activityCards = document.querySelectorAll(".activityCard");
  // for (let i = 0; i < activityCards.length; i++) {
  //   var activityCard = activityCards[i];
  //   var age = activityCard.dataset.age;
  //   if (age == selectedAge) {
  //     activityCard.style.display = "block";
  //   } else {
  //     activityCard.style.display = "none";
  //   }
  // } 

/*   var filterButton = document.getElementById('filterButton');
  filterButton.addEventListener('click', function () {
  var activityCards = document.querySelectorAll('.activityCard');
    for(let i = 0; i < activityCards.length; i++){
      var activityCard = activityCards[i];
      var location = activityCard.dataset.location;
      var age = activityCard.dataset.age;
      var type = activityCard.dataset.type;
      var price = activityCard.dataset.price;

      if((selectedLocation === "" || location === selectedLocation) && 
      (selectedAge === "" || age === selectedAge) && 
      (selectedType === "" || type === selectedType) && 
      (selectedPrice === "" || price <= selectedPrice)){
        activityCard.classList.remove('hidden');
          } else {
        activityCard.classList.add('hidden');
      }
    }
  }) */

    // var activityCards = document.createElement("div");
    // // activityCards.classList.add("col", "col-sm-4", "activityCard");
    // activityCards.classList.add("card", "col-sm-4", "activityCard");
    // activityCards.style.width = "18rem";
    // activityCards.style.cursor = "pointer";
    // // activityCards.addEventListener("click", function () {
    // //   generateDetailsPage(objects[i]);
    // // })

    // var activityImg = document.createElement("img");
    // activityImg.src = objects[i].images[0];
    // activityImg.className = "card-img-top";
    // activityImg.alt = objects[i].activityName;
    // activityImg.style.width = "100%";
    // activityImg.style.objectFit = "cover";


    // var activityCardDetails = document.createElement("div");
    // activityCardDetails.classList.add("card-body");

    // var activityLocation = document.createElement("h5");
    // activityLocation.classList.add("card-title");
    // activityLocation.textContent = objects[i].location;

    // var activityName = document.createElement("p");
    // activityName.classList.add("card-body");
    // activityName.textContent = objects[i].activityName;


    // var favouriteButton = document.createElement("button");
    // favouriteButton.classList.add("btn", "btn-info");
    // favouriteButton.textContent = "Add to Favourites";

    // activityCardDetails.appendChild(activityLocation);
    // activityCardDetails.appendChild(activityName);
    // activityCards.appendChild(activityImg);
    // activityCards.appendChild(activityCardDetails);
    // activityCards.appendChild(favouriteButton);

    // var searchResultsArray = [];

// async function getSearchResults() {
//   let response = await fetch(`activity/search/`)
//   let searchResults = await response.json()
//   console.log("Search results retrieved");
//   for (let i = 0; i < searchResults.length; i++) {
//     searchResultsArray.push(searchResults[i]);
//   }

// }

// getSearchResults();

// console.log(searchResultsArray);