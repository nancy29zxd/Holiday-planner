console.log(window.location.href)
window.onload = function(){
   
    var params = new URLSearchParams(window.location.search);
//   var userName = params.get("userName");
  var userEmail = params.get("userEmail");

 var favlink = `http://localhost:8000/favoriteslist.html?userEmail=`+encodeURIComponent( userEmail);

    console.log(favlink);
    document.getElementById("favourites").href = favlink;
}


// function search() {
// // const searchLat = document.getElementById("lat").value;
//     // const searchLong = document.getElementById("long").value;

//     const R = 6371; // radius of the Earth in km
//     const lat1 = toRadians(document.getElementById("lat").value); //56.33963, long: -2.78847 //document.getElementById("lat").value;
//     const lon1 = toRadians(document.getElementById("long").value);//document.getElementById("long").value;
//     // const points = [];
//     const radiusKm = 8; //10->8 , 15->12, 20->11
// console.log(lat1+""+lon1)
//     // calculate the latitudinal distance covered by 10km radius
//     const latDist = 2 * Math.asin(Math.sin(radiusKm / (2 * R)) / Math.cos(lat1));

//     // calculate the longitudinal distance covered by 10km radius
//     const lonDist = 2 * Math.asin(Math.sin(radiusKm / (2 * R)) / Math.cos(lat1)) / Math.cos(lat1);

//     // calculate the corner coordinates
//     const topLeftLat = toDegrees(lat1 + latDist / 2);
//     const topLeftLon = toDegrees(lon1 - lonDist / 2);
//     const bottomRightLat = toDegrees(lat1 - latDist / 2);
//     const bottomRightLon = toDegrees(lon1 + lonDist / 2);

//     console.log([[topLeftLat, topLeftLon], [bottomRightLat, bottomRightLon]]);
//     //getDistanceFromLatLonInKm()
//     // console.log( points);

//     searchFromServer(topLeftLat, topLeftLon, bottomRightLat, bottomRightLon);

//     // fetch("http://localhost:8000/activity/search", { method: "POST" }, { body: JSON.stringify({ topLeftLat: topLeftLat, topLeftLon: topLeftLon, bottomRightLat: bottomRightLat, bottomRightLon: bottomRightLon }) })
//     //     .then(res => res.json())
//     //     .then(data => { console.log(data) }).then( data=>
//     //         localStorage.setItem("myData", JSON.stringify(data)));
//     //         const data = JSON.parse(localStorage.getItem("myData"));
//     //         console.log(data);
//     //         window.location.href = "http://localhost:8000/results.html";

// }

async function searchFromServer() {
  // const response = await fetch("http://localhost:8000/activity/search",
  // { method: "POST" ,
  // headers: { 'Content-Type': 'application/json' },
  // body: JSON.stringify(
  //         {
  //             LAT: document.getElementById("lat").value,
  //             LONG: document.getElementById("long").value,

  //         })
  // });
  // const responseData = await response.json();
  // console.log(responseData);
  // localStorage.setItem("myData", JSON.stringify(responseData));
  // const localStoragedata = JSON.parse(localStorage.getItem("myData"));
  // console.log("localStoragedata"+localStoragedata);

  var params = new URLSearchParams(window.location.search);
  var userName = params.get("userName");
  var userEmail = params.get("userEmail");

  const hiddenParams = {
    userName: userName,
    userEmail: userEmail,
  };

  window.location.href =
    `http://localhost:8000/searchresults.html?LAT=` +
    encodeURIComponent(document.getElementById("lat").value) +
    "&LONG=" +
    encodeURIComponent(document.getElementById("long").value) +
    "&dist=" +
    encodeURIComponent(document.getElementById("distance").value)+"&"+new URLSearchParams(hiddenParams);
  // console.log(window.location.href);
  // console.log(window.location.href);
  // window.location.href = "http://localhost:8000/searchresults.html";
}

// function toRadians(degrees) {
//     return degrees * Math.PI / 180;
// }

// function toDegrees(radians) {
//     return radians * 180 / Math.PI;
// }

// function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
//     const R = 6371; // radius of the Earth in km
//     const dLat = toRadians(lat2 - lat1);
//     const dLon = toRadians(lon2 - lon1);
//     const a =
//         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//         Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
//         Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     const distance = R * c;

//     console.log(distance);
//     //return distance;
// }

// var player = videojs('video');
// player.on('ended', function() {
//     player.play();
//   });

//https://github.com/videojs/videojs-playlist/blob/main/docs/api.md

// const videojs = require('video.js');
// require('videojs-playlist');

var player = videojs('video', {
    autoplay: 'true',
    controls: 'true',
    fluid: 'true',
    playbackRates: [0.5, 1, 1.5, 2],
});
var videoList =
    [{ src: 'sunset-109471.mp4', type: "video/mp4" },
    { src: 'ruins-154227.mp4', type: "video/mp4" },
    { src: 'sea-114901.mp4', type: "video/mp4" }]

player.videoList
player.videoList.repeat(true);