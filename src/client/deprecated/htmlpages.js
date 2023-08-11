//Student 220018588 code

//const { database } = require("../server/config-db");

const response = [{ _id: "1", name: 'St Andrews West Sands Beach', images: ["https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", "https://images.pexels.com/photos/635279/pexels-photo-635279.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"], about: "", location: "West Sands", reviews: [{ userName: "Cath", comment: "Love the Sunset", rating: "4" }, { userName: "Rambo", comment: "The weather is too cold, but was fun", rating: "3" }], type: 'Beaches', cost: "20", LAT: "56.356225126965064", LON: "-2.8083373765679336" },
{ _id: "2", name: 'St Andrews Cathedral', images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/St_Andrews_cathedral_and_St_Rules_Tower.jpg/1200px-St_Andrews_cathedral_and_St_Rules_Tower.jpg"], about: "", location: "The Pends, St Andrews KY16 9QL", reviews: [{ userName: "Calvin", comment: "The Ancient stuff!, wow.", rating: "4" }, { userName: "Dasey", comment: "Best for short visit", rating: "3" }], type: 'Historic Sites', cost: "20", LAT: "56.33963344069176", LON: "-2.7884750021079303" }];


//https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
//Can add multiple classes to elements to create Bootstrap styling

function populateMainCards() {

    //This function will populate the main page with the information from the server
    
    for (let i = 0; i < response.length; i++) {
        var activityCards = document.createElement("div");
        activityCards.classList.add("col", "col-sm-4");
        activityCards.style.cursor = "pointer";
        activityCards.addEventListener("click", function () {
            generateDetailsPage(response[i]);
        })
        var activityImg = document.createElement("img");
        activityImg.src = response[i].images[0];
        activityImg.className = "card-img-top";
        activityImg.alt = response[i].name;
        activityImg.style.width = "100%";
        activityImg.style.objectFit = "cover";
        var activityCardDetails = document.createElement("div");
        activityCardDetails.classList.add("card-body");
        var activityLocation = document.createElement("h5");
        activityLocation.classList.add("card-title");
        activityLocation.textContent = response[i].location;
        var activityName = document.createElement("p");
        activityName.classList.add("card-body");
        activityName.textContent = response[i].name;
        activityCardDetails.appendChild(activityLocation);
        activityCardDetails.appendChild(activityName);
        activityCards.appendChild(activityImg);
        activityCards.appendChild(activityCardDetails);
        var divRow = document.querySelector(".row")
        divRow.appendChild(activityCards);
    }
}

populateMainCards()



function generateDetailsPage(data) {

    for (let i = 0; i < response.length; i++) {

        //This function will populate the detail page with the information from the server
        var detailPage = window.load("", "_blank");
        var activityPageTitle = detailPage.document.createElement("title");
        activityPageTitle.innerHTML = data[i].name;
        var activityName = document.createElement("h1");
        activityName.innerHTML = data[i].name;
        var activityLocation = document.createElement("h1");
        activityLocation.innerHTML = data[i].location;
        var activityImage = document.createElement("img");
        activityImage.src = data[i].images;
        activityImage.alt = data[i].name;
        var activityDescription = document.createElement("p");
        activityDescription.innerHTML = data[i].about;
        var activityRating = document.createElement("p");
        activityRating.innerHTML = data[i].reviews[0].rating;
        var activityPrice = document.createElement("p");
        activityPrice.innerHTML = data[i].cost;
        var activityType = document.createElement("p");
        activityType.innerHTML = data[i].type;
        var activityAge = document.createElement("p");
        activityAge.innerHTML = data[i].age;
        var activityComments = document.createElement("p");
        activityComments.innerHTML = data[i].reviews[0].comment;
        var pageName = document.getElementById("activityName");
        pageName.appendChild(activityName);
    }
}