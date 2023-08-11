

window.onload = previewImage();
function previewImage() {
    document.getElementById("imageInput").addEventListener("change", () => {
        const fileInput = document.getElementById("imageInput").files[0];

        const fileReader = new FileReader();

        fileReader.onload = () => {
            document.getElementById("preview").innerHTML = '<img class="preview" src=' + fileReader.result + '>'
        }
        fileReader.readAsDataURL(fileInput);
    });
}

let imageUrl ="";
async function uploadFile(event) {
    event.preventDefault();
    const formData = new FormData(document.getElementById('uploadFormImage'));
  const request =  await fetch('http://localhost:8000/activity/image', {
      method: 'POST',
      body: formData
    });
const response = await request.json()
imageUrl = response.url;
console.log(imageUrl)
   
    }

async function activitySubmit(event) {
    event.preventDefault();

    // const formData =  new FormData(document.getElementById('uploadForm'));

    // FormData(document.getElementById('uploadForm')).then((doc)=>{document.getElementById(doc)});
    // formData.append("date", "dateString");

    // Get the input values from the form fields
    const form = document.getElementById('uploadForm');
    var review = [{ userName: "Author", comment: "I recommmend this", rating: form.elements.rating.value }];

    const image = imageUrl;
    //image.append('file',document.getElementById("imageInput").files[0]);

    //fetch("http://localhost:8000/uploadImage",{metho d:'POST',body:{"file":image}}).then((response)=>console.log(response))
    
    // make the lan and lng into float for accurate location (by 220022259)
    let latFloat = parseFloat(form.elements.lat.value);
    let longFloat = parseFloat(form.elements.lon.value);

    var newActivity = {

        activityName: form.elements.activityName.value,
        lat: latFloat,
        long: longFloat,
        location: form.elements.location.value,
        age: form.elements.age.value,
        type: form.elements.type.value,
        price: form.elements.price.value,
        description: form.elements.description.value,
        images: [image],
        reviews: review

    }
console.log(newActivity)
  const request =   await fetch('http://localhost:8000/activity/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newActivity)
    });
    var response = await request.json()  
        //.then(txt => alert(txt))
    console.log(response)
    if (request.ok) {
        window.alert(response.msg);
    }else{
        window.alert(response.msg);
    }

    // Do something with the values, for example, print them to the console
    //console.log(activityName, activityType, latitude, longitude);
    console.log(document.getElementById('uploadForm'));

}