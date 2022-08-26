//Mettre le code JavaScript lié à la page photographer.html

let params = new URL(document.location).searchParams;
let id = parseInt(params.get("id"));

let photographerContainer = document.querySelector(".photograph-header");

async function getOnePhotographer() {
    let data = await fetch("data/photographers.json").then((res) => {
        return res.json();
    });

    let filteredPhotographersArray = data.photographers.filter(
        (photographer) => photographer.id === id
    );

    let photographerInfos = filteredPhotographersArray[0];

    console.log(photographerInfos);

    let filteredMediasArray = data.media.filter(
        (file) => file.photographerId === id
    );
    console.log(filteredMediasArray);

    let photographerFullData = {...photographerInfos, filteredMediasArray}
    console.log(photographerFullData)


    return photographerFullData;
}



async function displayPhotographerProfile(){
    let {name, city, country, tagline, portrait} = await getOnePhotographer();

    const picture = `assets/FishEye_Photos/Sample Photos/Photographers ID Photos/${portrait}`;

    let contactButton = document.querySelector(".contact_button")


    const leftDiv = document.createElement('div');
    
    const h1 = document.createElement('h1');
    h1.textContent= name
    const locationDiv = document.createElement('div');
    locationDiv.classList.add('location')
    locationDiv.textContent = city + ", " + country;
    const taglineDiv = document.createElement('div');
    taglineDiv.textContent = tagline;
    const img = document.createElement('img');
    img.setAttribute("src", picture);
    img.setAttribute("alt", name);
    
    photographerContainer.insertBefore(leftDiv, contactButton);
    photographerContainer.appendChild(img);
    leftDiv.appendChild(h1);
    leftDiv.appendChild(locationDiv)
    leftDiv.appendChild(taglineDiv)

};

displayPhotographerProfile();


async function displayMedias() {

    let {filteredMediasArray} = await getOnePhotographer();

    function openCloseDropdownButton(/* medias */) {
        const sortingBlock = document.querySelector(".sorting-block");
        const button = sortingBlock.querySelector(".dropdown-button");
        const buttonText = button.querySelector(".dropdown-button-text");
        button.addEventListener("click", () => {
            sortingBlock.classList.toggle("open");
        });
      
        sortingBlock.querySelectorAll("a").forEach((element) => {
          element.addEventListener("click", (event) => {
            event.preventDefault();
            const previousButtonValue = buttonText.textContent;
            buttonText.textContent = event.currentTarget.textContent;
            event.currentTarget.textContent = previousButtonValue;
        //    sortMedias(medias, buttonText.textContent);
        //    buildMedia(medias);
        //    initLightboxLinks();
          });
        })
    }

    openCloseDropdownButton()
    

}

displayMedias();
