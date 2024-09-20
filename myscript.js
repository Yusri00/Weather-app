const apiUrl=('länk');

fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Sorry, something went wrong')
        }else if(response.status===404){
            throw new Error('404: server not found');
        }else if(response.status===505){
            throw new Error('505: server not found');
        }
        return response.json();  // Call the function to parse JSON
    })
    .then(data => {
        console.log(data);  // Handle the fetched data
    })
    .catch(error => {
        console.error('Error:', error);  // Handle errors
    });

/*fetch('https://open-meteo.com/' , )
    .then(response=>{
        if (!response.ok){
        console.log("Error);
}) response.json());
    .then(data=>console.log(data))
         .catch(error => console.error('Error: ', error));
*/

//Changes background pictures depending on temperature
function changeImage(temperature){
    let weatherImage=document.getElementById('weather-image');

    if(temperature >= 25){
       weatherImage.src="sun.jpg";
    }else if(temperature>=18){ //Handles temperature between 18-24 
        weatherImage.src="clear.jpg";
    }else if(temperature>=15){ //Handles temperature between 15-17
        weatherImage.src="thunder.jpg";
    }else if(temperature>=12){ //Handles temperature between 12-14 
        weatherImage.src="cool.jpg";
    }else if (temperature>=8){ //Handles temperature between 8-10 
        weatherImage.src="rain.jpg";
    }else{
        weatherImage.src='snow.jpg'; //Handles temperature between everything less than 7
    }
    }

