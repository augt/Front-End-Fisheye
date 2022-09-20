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

  let photographerFullData = { ...photographerInfos, filteredMediasArray };
  console.log(photographerFullData);

  return photographerFullData;
}

async function displayPhotographerProfile() {
  let { name, city, country, tagline, portrait } = await getOnePhotographer();

  const picture = `assets/FishEye_Photos/Sample Photos/Photographers ID Photos/${portrait}`;

  let contactButton = document.querySelector(".contact_button");

  const leftDiv = document.createElement("div");

  const h1 = document.createElement("h1");
  h1.textContent = name;
  h1.setAttribute("id", "header-photographer-name");
  const locationDiv = document.createElement("div");
  locationDiv.classList.add("location");
  locationDiv.textContent = city + ", " + country;
  const taglineDiv = document.createElement("div");
  taglineDiv.textContent = tagline;
  const img = document.createElement("img");
  img.setAttribute("src", picture);
  img.setAttribute("alt", name);

  photographerContainer.insertBefore(leftDiv, contactButton);
  photographerContainer.appendChild(img);
  leftDiv.appendChild(h1);
  leftDiv.appendChild(locationDiv);
  leftDiv.appendChild(taglineDiv);
}

displayPhotographerProfile();

displayMedias();

async function displayMedias() {
  let { filteredMediasArray, name, price } = await getOnePhotographer();
  sortMedias(filteredMediasArray, "Popularité");
  let mediaListContainer = document.querySelector(".medias-list");
  let LikesTotalAndPriceDiv = document.querySelector(".likes-total-and-price");
  let lightboxListContainer = document.querySelector("#lightbox_modal");
  generateLightBoxList(name);
  renderMediaList(name);

  function openCloseDropdownMenu() {
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
        sortMedias(filteredMediasArray, buttonText.textContent);
        console.log(filteredMediasArray);
        mediaListContainer.innerHTML = "";
        LikesTotalAndPriceDiv.innerHTML = "";
        lightboxListContainer.innerHTML = "";
        generateLightBoxList(name);
        renderMediaList(name);
      });
    });
  }

  openCloseDropdownMenu();

  function sortMedias(filteredMediasArray, sortingChoice) {
    switch (sortingChoice) {
      case "Date":
        filteredMediasArray.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "Titre":
        filteredMediasArray.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "Popularité":
        filteredMediasArray.sort((a, b) => b.likes - a.likes);
    }
  }

  function renderMediaList(photographerName) {
    filteredMediasArray.forEach((media) => {
      const mediaModel = mediaFactory(media, false);
      const mediaCardDOM = mediaModel.getMediaCardDOM(photographerName);
      const templatePhotographerMedia = `
        <div class="photographer-media" id="${media.id}">
          <a href="#" class="media-image" aria-label="${media.title}, closeup view">${mediaCardDOM.outerHTML}</a>
          <div class="media-info">
            <p class="media-title">${media.title}</p>
            <div class="media-like">
              <p class="like-number">${media.likes}</p>
              <button class="button-like" type="button">
                <em class="like-icon fa-solid fa-heart" aria-label="likes"></em>
              </button>
            </div>
          </div>
        </div>
        `;
      mediaListContainer.insertAdjacentHTML(
        "beforeend",
        templatePhotographerMedia
      );
    });

    // LINKS TO LIGHTBOX
    let lightboxLinkList = document.querySelectorAll(`.media-image`);

    let lightboxItemsList = document.querySelectorAll(".lightbox-item");

    let main = document.querySelector("main");
    let header = document.querySelector("header")

    for (let link of lightboxLinkList) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        let slidePosition = Array.from(lightboxLinkList).indexOf(link);

        lightboxListContainer.style.display = "block";

        main.style.display = "none";
        header.style.display = "none";


        lightboxItemsList[slidePosition].style.display = "flex";
      });
    }

    // DISPLAY LIKES TOTAL AND PRICE
    renderLikesTotalAndPrice();
  }

  function renderLikesTotalAndPrice() {
    let likesArray = [];
    let reducer = (previousValue, currentValue) => previousValue + currentValue;
    for (let media of filteredMediasArray) {
      likesArray.push(media.likes);
    }
    let likesSum = likesArray.reduce(reducer);

    const template = `
    <div class="total-like">
      <p class="like-totalnumber">${likesSum}</p>
      <i class="fa-solid fa-heart"></i>
    </div>
    <p class="salary-per-day">${price}€ / jour</p>
  `;
    LikesTotalAndPriceDiv.insertAdjacentHTML("beforeend", template);
  }

  // MANAGING LIGHTBOX

  function generateLightBoxList(photographerName) {

    filteredMediasArray.forEach((item, index) => {
      const mediaModel = mediaFactory(item, true);
      const mediaCardDOM = mediaModel.getMediaCardDOM(photographerName);
      const templateMediaLightboxItem = `
        <div id="${item.id}" class="lightbox-item">
        <a class="lightbox-prev" title="previous image" href="#" aria-label="Previous image">
          <em class="fa-solid fa-angle-left"></em>
        </a>
        <div>
          ${mediaCardDOM.outerHTML}
          
          <p class="item-title">${item.title}</p>
        </div>
        <a class="lightbox-next" href="#" aria-label="Next image" title="next image">
        <em class="fa-solid fa-angle-right"></em>
        </a>
        <button class="lightbox-close" title="next image" aria-label="Close dialog"><em class="fa-solid fa-xmark"
          aria-label="close"></em></button>
        </div>
        `;
      lightboxListContainer.insertAdjacentHTML(
        "beforeend",
        templateMediaLightboxItem
      );
    });

    //manage closing lightbox modal

    let lightboxItemsList = document.querySelectorAll(".lightbox-item");

    let closeLightboxButtonList = document.querySelectorAll(".lightbox-close");

    let main = document.querySelector("main");
    let header = document.querySelector("header")

    for (let closeButton of closeLightboxButtonList) {
      closeButton.addEventListener("click", function (e) {
        e.preventDefault

        let slidePosition = Array.from(closeLightboxButtonList).indexOf(closeButton);

        lightboxListContainer.style.display = "none";

        lightboxItemsList[slidePosition].style.display = "none";

        main.style.display = "unset";
        header.style.display = "unset";

      });
    }
  }
}
