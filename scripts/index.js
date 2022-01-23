// Commonly used values
const api_key = '104785588736622';

const favFalse = '../assets/images/whitestarRep.png';
const favTrue = '../assets/images/red_star.png';


// create object for this app in localStorage if not present
checkLocalStorage();

// main search event
const SearchBar=document.getElementById('search-data');
let timeoutid;
const Oninput=(e)=>{


    if(timeoutid)
    {
        clearTimeout(timeoutid);
    }
    timeoutid=setTimeout(() => {
        const SearchString= e.target.value;
    console.log("searching for "+SearchString);  
    checkString(SearchString);



    }, 500);


}   

SearchBar.addEventListener('input',Oninput);
// check string is valid // if valid we will call the function

function checkString(searchString)
{
   if (searchString.length < 2){       // avoiding huge number of search results
       console.log("add atleast 3 characters");
        document.getElementById('results').innerHTML = 'Add some character';
   }
   else{
       fetchhero(searchString);
   }
}


// Initialize localStorage entry
function checkLocalStorage(){
    if (localStorage.getItem('superheroFavs')==null){
        localStorage.setItem('superheroFavs', JSON.stringify(Array()));
    }
}

// Handling details, add favourite actions
document.addEventListener('click', (event) => {
    // Details button
    if(event.target.id == 'details_btn'){
        var id = event.target.parentNode.id;
        window.open('./details.html'+'?id='+id, "_self");
    }
    // Favourite button
    else if(event.target.id == 'add_fav_btn'){
        var id = event.target.parentNode.parentNode.id;
        var favs = JSON.parse(localStorage.getItem('superheroFavs'));
        // fav button decide
        if (favs.indexOf(id) != -1){
            favs = favs.filter((item) => item!=id);
            localStorage.setItem('superheroFavs',JSON.stringify(favs));
            event.target.src = favFalse;
            customAlert('failure','Removed from fav');
        }
        else{
            favs.push(id);
            localStorage.setItem('superheroFavs',JSON.stringify(favs));
            event.target.src = favTrue;
            customAlert('success','Added to fav');
        }
    }
});


async function fetchhero(SearchString)
{

    let res=await fetch('https://superheroapi.com/api.php/'+api_key+'/search/'+SearchString);
    if(res.ok)
    {
        console.log(res.json);
        console.log(res);
        renderData(await res.json()); // obj is passed
    }
    else
    {
        console.log("error is there"+res.status);
    }
}

function renderData(data){
    // Checking if there's anything found
    if(data.response=='error' || data.results.length === 0){
        document.getElementById('results').innerHTML = data.error;   
    }
    else{
        // deleting previous results
        var results = document.getElementById('results');
        results.remove();

        // Creating new results
        var result_container = document.getElementById('result-container');
        var results = document.createElement('DIV');
        results.id = 'results';
        result_container.appendChild(results);
        
        // rendering each heroes
        data.results.forEach((element) => {
            results.appendChild(getCard(element));
        });
    }
}


function getCard(data){
    // Card container
    var cardContainer = document.createElement('DIV');
    cardContainer.className = 'card-container center';
    cardContainer.id = data.id;
    var srcFav;
    var favs = JSON.parse(localStorage.getItem('superheroFavs'));
    // Checking if the hero is fav or not
    if(favs.indexOf(data.id) !== -1){
        srcFav = favTrue;
    }
    else{
        srcFav = favFalse;
    }
    cardContainer.innerHTML = `
        <div class="card-img-container">
            <img src="${data.image.url}">
        </div>
        <div id="details_btn" class="card-name">${data.name}</div>
        <div class="card-btns">
            <img id="add_fav_btn" src="${srcFav}" width="25">
        </div>
    `
    return cardContainer;
}

// For changing visibility of alert box
// function customAlert(type, message){
//     var element = document.getElementsByClassName(type);
//     element[0].innerHTML = message;
//     element[0].style.visibility = "visible"
//     setTimeout(() => {
//         element[0].style.visibility = "hidden";
//     }, 1500);
// }