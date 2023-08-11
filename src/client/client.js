// open tab that is selected
function openTab(evt, page) {
  var tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabContent");
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(page).style.display = "block";
  evt.currentTarget.className += " active";
}

// set up the googla map API
let map;
let geocoder;
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 56.339798, lng: -2.80834 },
    zoom: 14,
  })

geocoder = new google.maps.Geocoder();

  map.addListener("click", (event) => {
    placeMarkerAndPanTo(event.latLng, map);
  });
}

function geoCodeLocation(){
  var address = document.getElementById("address").value;
  geocoder.geocode({'address': address}, function(results, status){
    if(status === 'OK'){
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location
      });
      console.log(results[0].geometry.location.lat())
      console.log(results[0].geometry.location.lng())
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

let currentPosition; // set a variable for current position

// showing lat & lng when clicking on the map
// bug: when clicking multiple places, the markers accummulated
function placeMarkerAndPanTo(latLng, map) {
  new google.maps.Marker({
    position: latLng,
    map: map,
  });
  map.panTo(latLng);
  var selectedLatAndLng = { latitude: latLng.lat(), longitude: latLng.lng() }
  console.log("this is the latitude from latLng", latLng.lat());
  console.log("this is the longitude from latLng", latLng.lng());
  console.log(selectedLatAndLng)
  const showedLatAndLng = document.getElementById("selectedLatAndLng-id");
  document.getElementById("lat").value = selectedLatAndLng.latitude.toFixed(5);
  document.getElementById("long").value = selectedLatAndLng.longitude.toFixed(5);
  // showedLatAndLng.innerHTML = "You have selected " + selectedLatAndLng.latitude + ", " + selectedLatAndLng.longitude;
  return latLng;
}

// access data filled in the form
function activitySubmit() {
  let activityNameInput = document.getElementById("activityName_input").value;
  let latInput = document.getElementById("lat_input").value;
  let lngInput = document.getElementById("lng_input").value;
  let ageInput = document.getElementById("age_select").value;
  let priceSelected = document.getElementById("price_select").value;
  let description = document.getElementById("description_input").value;
  let activityType = document.getElementById("activityType_input").value;
  let rating = document.getElementById("rating_select").value;

  const newActivity = {
    activityName: activityNameInput,
    lat: latInput,
    lng: lngInput,
    age: ageInput,
    type: activityType,
    price: priceSelected,
    description: description,
    rating: rating
  }
  const submitButton = document.getElementById("activitySubmit_btn");
  submitButton.onclick = function () {
    postToServer(newActivity, '/activity/add');

  }
}

// pass data to the server, data: what to be passed; url: where to be passed to. e.g. "/upload"
function postToServer(data, url) {
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then((response) => {
      if (!response.ok) {
        console.log("Error");
      }
      return response.json();
    })
    .then(data => {
      console.log('success', data);
    })
    .catch((error) => {
      console.log("error!", error);
    })
}


// pop up login functionality on the top right of the screen

function openForm() {
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}

function openRegisterForm() {
  document.getElementById("myRegisterForm").style.display = "block";
}

function closeRegisterForm() {
  document.getElementById("myRegisterForm").style.display = "none";
}




// call this function when clicking "Check Activities Nearby" button in Home page
// 1. pass these values to the database and search
// 2. link to result page with the lat & lng values
function searchNearbyActivity() {
  var latInput = document.getElementById("latSearchBar_input").value;
  var lngInput = document.getElementById("lngSearchBar_input").value;

  var url = `results.html?lat=${latInput}&lng=${lngInput}`;
  window.location.href = url;
  // post this bound to the server and database
  postToServer(bound, '/searchNearby');
}