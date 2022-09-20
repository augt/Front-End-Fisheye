function mediaFactory(data, isLightbox) {
    const { title } = data;

    function getMediaCardDOM(photographerName) {
        const mediaCardDOM = document.createElement('div');
        if (isLightbox){
            mediaCardDOM.classList.add("lightbox-card");
        } else {
            mediaCardDOM.classList.add("media-card");
        }
        

        let mediaUrl = "";

        if (data.hasOwnProperty("image")){
            mediaUrl = `assets/FishEye_Photos/Sample Photos/${photographerName}/${data.image}`;
            let image = document.createElement('img');
            image.setAttribute("src", mediaUrl);
            image.setAttribute("alt", title);
            mediaCardDOM.appendChild(image);

        } else {
            mediaUrl = `assets/FishEye_Photos/Sample Photos/${photographerName}/${data.video}`;
            let video = document.createElement('video');
            if (isLightbox===true){
                video.setAttribute("controls", true);
            };
            mediaCardDOM.appendChild(video);
            let source = document.createElement('source');
            source.setAttribute("src", mediaUrl);
            source.setAttribute("type", "video/mp4");
            video.appendChild(source);
        }

         
  
        return (mediaCardDOM);
    }

    return { title, getMediaCardDOM }
}