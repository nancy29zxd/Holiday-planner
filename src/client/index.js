
var loggedUserEmail; // to store in local storage
var loggedUserName;

// function to log in a user from the login form 
async function loginUser() {
    // get the data from the form
    var username = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    if (username == "" || email == "" || password == "") {
        window.alert("Enter all values")
    } else {
        // make a post request to the login endpoint with this data
        const url = '/user/login';
        const data = {
            userEmail: email,
            password: password
        };

        const request = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let response = await request.json();
        console.log(response)
        if (request.ok) {
            loggedUserEmail = email;

            localStorage.setItem("userEmail", JSON.stringify(loggedUserEmail));
            localStorage.setItem("userName", JSON.stringify(username));
            const localStoragedata = JSON.parse(localStorage.getItem("userEmail"));
            console.log("localStoragedata" + localStoragedata);
            console.log(loginUser);

            const hiddenParams = {
                userName: username,
                userEmail: email ,
              };


            window.location.href = `http://localhost:8000/mainpage1.html?${new URLSearchParams(hiddenParams)}`

        } else {
            window.alert("Login Failed");

        }

    }



}



// function to register a user from the register form 
async function registerUser() {
    //document.getElementById("username").show()
    // get the data from the form
    var username = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;


    // make a post request to the login endpoint with this data
    const url = '/user/register';
    const data = {
        userEmail: email,
        userName: username,
        password: password
    };

    const request = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    let response = await request.json();
    console.log(response)
    if (request.ok) {
        window.alert("Registered login")



    } else {
        window.alert("Register Failed");

    }
}