function mediaFactory(data) {
    const { title } = data;

    function getMediaCardDOM(photographerName) {
        const mediaCardDOM = document.createElement('div');
        mediaCardDOM.classList.add("media-card");

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
            video.removeAttribute("controls");
            mediaCardDOM.appendChild(video);
            let source = document.createElement('source')
            source.setAttribute("src", mediaUrl)
            source.setAttribute("type", "video/mp4")
            video.appendChild(source);
        }

         
  
        return (mediaCardDOM);
    }

    return { title, getMediaCardDOM }
}