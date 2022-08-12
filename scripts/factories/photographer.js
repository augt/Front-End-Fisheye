function photographerFactory(data) {
    const { name, portrait, id, city, country, tagline, price } = data;

    const picture = `assets/FishEye_Photos/Sample Photos/Photographers ID Photos/${portrait}`;

    function getUserCardDOM() {
        const article = document.createElement('article');
        const photographerLink = document.createElement('a')
        photographerLink.setAttribute("href", "photographer.html?id=" + id)
        photographerLink.setAttribute("aria-label", "Profil de " + name)
        const img = document.createElement('img');
        img.setAttribute("src", picture);
        img.setAttribute("alt", name);
        const h2 = document.createElement('h2');
        const locationDiv = document.createElement('div');
        const taglineDiv = document.createElement('div');
        const priceDiv = document.createElement('div');
        locationDiv.textContent = city + ", " + country;
        taglineDiv.textContent = tagline;
        priceDiv.textContent = price + "€/jour"
        h2.textContent = name;
        article.appendChild(photographerLink);
        photographerLink.appendChild(img);
        article.appendChild(h2);
        article.appendChild(locationDiv);
        locationDiv.classList.add('location')
        article.appendChild(taglineDiv);
        article.appendChild(priceDiv);
        priceDiv.classList.add('price')
  
        return (article);
    }
    return { name, picture, getUserCardDOM }
}