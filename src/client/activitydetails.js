
// var activitiy = {
//     _id: "1", activityName: 'St Andrews West Sands Beach', lat: 56.35622, long: -2.80834, location: "West Sands",
//     age: "5+", type: 'Beaches', price: "20",
//     decription: "", images: ["https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", "https://images.pexels.com/photos/635279/pexels-photo-635279.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"],
//     reviews: [{ userName: "Cath", comment: "Love the Sunset", rating: "4" }, { userName: "Rambo", comment: "The weather is too cold, but was fun", rating: "3" }]
// }



var activitiy = JSON.parse(localStorage.getItem("selectedActivity"));
console.log(activitiy);

const userNameLogged = JSON.parse(localStorage.getItem("userName"));


window.onload = displayActivity(activitiy);


function displayActivity(activitiy) {

    console.log(activitiy)
    console.log(userNameLogged)
    document.getElementById("activityName").innerHTML = activitiy.activityName;
    document.getElementById("location").innerHTML = "<strong>Location:</strong> " + activitiy.location;
    document.getElementById("age").innerHTML = "<strong>Age:</strong> " + activitiy.age;
    document.getElementById("type").innerHTML = "<strong>Type:</strong> " + activitiy.type;
    document.getElementById("price").innerHTML = "<strong>Price:</strong> $" + activitiy.price;
    document.getElementById("description").innerHTML = activitiy.decription;

    var images = document.getElementById("images");
    for (var i = 0; i < activitiy.images.length; i++) {
        var image = activitiy.images[i];
        var item = document.createElement("div");
        if (image !== "") {
            item.className = i == 0 ? "carousel-item active" : "carousel-item";
            item.innerHTML = "<img src='" + image + "' class='d-block w-100' alt=''>";
            images.querySelector(".carousel-inner").appendChild(item);
        }
    }


    var reviews = document.getElementById("reviews");
   
    for (var i = 0; i < activitiy.reviews.length; i++) {
        var review = activitiy.reviews[i];
        let stars = '';
        for (let i = 0; i < review.rating; i++) {
            stars += '&#9733;';
          }
        
        var item = document.createElement("div");
        item.className = "card mb-3";
        item.innerHTML = "<div class='card-body'><h5 class='card-title'>" + review.userName + "</h5><p class='card-text'>" + review.comment + "</p><p class='card-text'><small class='text-muted'>Rating: " + stars + "</small></p></div>";
        reviews.appendChild(item);
    }
}

async function AddComment() {
    var params = new URLSearchParams(window.location.search);
    var userName = params.get("userName");
   
  

    var userName = userName;
    var userComment = document.getElementById("userComment").value;
    var rantingValue = document.getElementById("rating").value;
    // var userRating = "3";
    var userRating = parseInt(rantingValue).toString()
    
    const data = {
        userName: userName,
        userComment: userComment,
        userRating: userRating
    }

    console.log(activitiy._id)

    // add comment to server
    const request = await fetch(`http://localhost:8000/review/add/${activitiy._id}`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    let reposnse = await request.json();

    if(request.ok){
        console.log("Added Comment");
        // get activity again
        getActivity(activitiy._id)
    }else{
        console.log(reposnse)
    }

}



function getActivity(id) {

    fetch(`http://localhost:8000/activity/get/${id}`, {
        method: "GET"
    })
        .then(res => res.text())
        .then(txt => {
            console.log(txt)
            // store new fetched activity to local storage
            localStorage.setItem("selectedActivity", txt);
            // reload page and display new activity data
            window.location.reload();
        })
        .catch(err => console.log(err))
}