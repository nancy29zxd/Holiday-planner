// set up the googla map API
let map;
function initMap(){
    map = new google.maps.Map(document.getElementById("map"),{
        center: {lat: 56.339798, lng:-2.80834},
        zoom: 14,
        })

    // add markers to the position when clicking on the map
    map.addListener("click", (event) => {
        placeMarkerAndPanTo(event.latLng, map);
    });
    // get the lat and long from the database
    fetch('/activity/get', {
        method: 'GET',
        header: {
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
        for (let i = 0; i < data.length; i++){
            let activityLAT = data[i].lat;
            let activityLONG = data[i].long;
            let activityLanLng = new google.maps.LatLng(activityLAT, activityLONG);
            placeMarkerAndPanTo(activityLanLng, map)
        }
      })
      .catch((error) => {
        console.log("Fetching error", error);
      });
}
let currentPosition; // set a variable for current position

// showing lat & lng when clicking on the map
// bug: when clicking multiple places, the markers accummulated
function placeMarkerAndPanTo(latLng) {
    new google.maps.Marker({
      position: latLng,
      map: map,
    });
    console.log("latLng is ", typeof(latLng))
    console.log("latLng is ", latLng)

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