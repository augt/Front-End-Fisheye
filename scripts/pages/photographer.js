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

  let filteredMediasArray = data.media.filter(
    (file) => file.photographerId === id
  );

  let photographerFullData = { ...photographerInfos, filteredMediasArray };

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

    // Manage Lightbox opening
    let lightboxLinkList = document.querySelectorAll(`.media-image`);

    let lightboxItemsList = document.querySelectorAll(".lightbox-item");

    let main = document.querySelector("main");

    for (let link of lightboxLinkList) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        let slidePosition = Array.from(lightboxLinkList).indexOf(link);

        lightboxListContainer.setAttribute("aria-hidden", "false");
        lightboxItemsList[slidePosition].setAttribute("aria-hidden", "false");
        main.setAttribute("aria-hidden", "true");

        lightboxListContainer.style.display = "block";
        lightboxItemsList[slidePosition].style.display = "flex";

        getTabbableElements(document).forEach(
          (tabbable) => (tabbable.tabIndex = -1)
        );
        getTabbableElements(lightboxItemsList[slidePosition]).forEach(
          (tabbable) => (tabbable.tabIndex = 0)
        );
      });
    }

    // DISPLAY LIKES TOTAL AND PRICE
    renderLikesTotalAndPrice();

    // Manage clicks on like button
    let likeButtonsList = document.querySelectorAll(".button-like");

    let likeCounterList = document.querySelectorAll(".like-number");

    let totalLikeCounter = document.querySelector(".like-total-number");

    for (let likeButton of likeButtonsList) {
      likeButton.addEventListener("click", function (e) {
        if (!likeButton.dataset.liked) {
          let buttonIndex = Array.from(likeButtonsList).indexOf(likeButton);

          let likeScore = parseInt(likeCounterList[buttonIndex].textContent);

          let totalLikeScore = parseInt(totalLikeCounter.textContent);

          likeCounterList[buttonIndex].textContent = likeScore + 1;

          totalLikeCounter.textContent = totalLikeScore + 1;

          likeButton.dataset.liked = true;
        }
      });
    }
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
      <p class="like-total-number">${likesSum}</p>
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
        <div id="${item.id}" class="lightbox-item" aria-label="Image closeup view" aria-hidden="true">
        <a class="lightbox-prev" title="Previous image" href="#" aria-label="Previous image">
          <em class="fa-solid fa-angle-left"></em>
        </a>
        <div>
          ${mediaCardDOM.outerHTML}
          
          <p class="item-title">${item.title}</p>
        </div>
        <a class="lightbox-next" href="#" aria-label="Next image" title="Next image">
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

    // manage closing lightbox modal

    let lightboxItemsList = document.querySelectorAll(".lightbox-item");

    let closeLightboxButtonsList = document.querySelectorAll(".lightbox-close");

    for (let closeButton of closeLightboxButtonsList) {
      closeButton.addEventListener("click", function (e) {
        e.preventDefault;
        closeLightbox(closeLightboxButtonsList, closeButton);
      });
    }

    function closeLightbox(closeLightboxButtonsList, closeButton) {
      let slidePosition = Array.from(closeLightboxButtonsList).indexOf(
        closeButton
      );

      lightboxListContainer.setAttribute("aria-hidden", "true");
      lightboxItemsList[slidePosition].setAttribute("aria-hidden", "true");
      main.setAttribute("aria-hidden", "false");

      lightboxListContainer.style.display = "none";

      lightboxItemsList[slidePosition].style.display = "none";
      getTabbableElements(document).forEach(
        (tabbable) => (tabbable.tabIndex = 0)
      );
      getTabbableElements(lightboxItemsList[slidePosition]).forEach(
        (tabbable) => (tabbable.tabIndex = -1)
      );
    }

    // manage click on lightbox next button

    let nextButtonsList = document.querySelectorAll(".lightbox-next");

    for (let nextButton of nextButtonsList) {
      nextButton.addEventListener("click", function (e) {
        e.preventDefault;
        showNextSlide(nextButtonsList, nextButton);
      });
    }

    function showNextSlide(nextButtonsList, nextButton) {
      let slidePosition = Array.from(nextButtonsList).indexOf(nextButton);

      let slideIndexToShow = slidePosition + 1;

      if (slideIndexToShow === nextButtonsList.length) {
        slideIndexToShow = 0;
      }

      lightboxItemsList[slidePosition].setAttribute("aria-hidden", "true");
      lightboxItemsList[slideIndexToShow].setAttribute("aria-hidden", "false");

      lightboxItemsList[slidePosition].style.display = "none";

      lightboxItemsList[slideIndexToShow].style.display = "flex";
      getTabbableElements(document).forEach(
        (tabbable) => (tabbable.tabIndex = -1)
      );
      getTabbableElements(lightboxItemsList[slideIndexToShow]).forEach(
        (tabbable) => (tabbable.tabIndex = 0)
      );
    }

    // manage click on lightbox previous button

    let prevButtonsList = document.querySelectorAll(".lightbox-prev");

    for (let prevButton of prevButtonsList) {
      prevButton.addEventListener("click", function (e) {
        e.preventDefault;
        showPrevSlide(prevButtonsList, prevButton);
      });
    }

    function showPrevSlide(prevButtonsList, prevButton) {
      let slidePosition = Array.from(prevButtonsList).indexOf(prevButton);

      let slideIndexToShow = slidePosition - 1;

      if (slideIndexToShow === -1) {
        slideIndexToShow = prevButtonsList.length - 1;
      }

      lightboxItemsList[slidePosition].setAttribute("aria-hidden", "true");
      lightboxItemsList[slideIndexToShow].setAttribute("aria-hidden", "false");

      lightboxItemsList[slidePosition].style.display = "none";

      lightboxItemsList[slideIndexToShow].style.display = "flex";

      getTabbableElements(document).forEach(
        (tabbable) => (tabbable.tabIndex = -1)
      );
      getTabbableElements(lightboxItemsList[slideIndexToShow]).forEach(
        (tabbable) => (tabbable.tabIndex = 0)
      );
    }

    // manage click on keyboard arrows and escape key

    document.addEventListener("keyup", (e) => {
      let activeLightboxIndex = Array.from(lightboxItemsList).findIndex(
        (lightbox) => lightbox.ariaHidden === "false"
      );

      if (e.key === "ArrowRight") {
        showNextSlide(nextButtonsList, nextButtonsList[activeLightboxIndex]);
      }

      if (e.key === "ArrowLeft") {
        showPrevSlide(prevButtonsList, prevButtonsList[activeLightboxIndex]);
      }

      if (e.key === "Escape") {
        closeLightbox(
          closeLightboxButtonsList,
          closeLightboxButtonsList[activeLightboxIndex]
        );
      }
    });
  }
}
