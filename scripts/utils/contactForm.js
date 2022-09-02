function displayModal() {
    const modal = document.getElementById("contact_modal");
	modal.style.display = "block";
    const main = document.getElementById("main");
    main.setAttribute("aria-hidden", "true");
    modal.setAttribute("aria-hidden", "false");

}

function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
    const main = document.getElementById("main");
    main.setAttribute("aria-hidden", "true");
    modal.setAttribute("aria-hidden", "false");
}
