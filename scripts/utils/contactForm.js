const modal = document.getElementById("contact_modal");
const main = document.getElementById("main");
const firstNameInput = document.getElementById("first-name");
const lastNameInput = document.getElementById("last-name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const submitMessageButton = document.getElementById("submit-message");
const form = document.querySelector("form");

function displayModal() {
  modal.style.display = "block";
  main.setAttribute("aria-hidden", "true");
  modal.setAttribute("aria-hidden", "false");
  const modalNameTag = document.getElementById("contact-photographer-name");
  const mainNameTag = document.getElementById("header-photographer-name");
  modalNameTag.innerHTML = `Contactez-moi <br> ${mainNameTag.innerHTML}`;
  getTabbableElements(document).forEach((tabbable) => (tabbable.tabIndex = -1));
  getTabbableElements(modal).forEach((tabbable) => (tabbable.tabIndex = 0));
}

function closeModal() {
  modal.style.display = "none";
  main.setAttribute("aria-hidden", "false");
  modal.setAttribute("aria-hidden", "true");
  getTabbableElements(document).forEach((tabbable) => (tabbable.tabIndex = 0));
}

document.addEventListener("keyup", (e) => {
  if (modal.ariaHidden === "false" && e.key === "Escape") {
    closeModal();
  }
});

// allow modal inputs to be usable with tab
function getTabbableElements(domElement) {
  return domElement.querySelectorAll(
    'button, [href], input, textarea, [tabindex]:not([tabindex="-1"])'
  );
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  console.log(firstNameInput.value);
  console.log(lastNameInput.value);
  console.log(emailInput.value);
  console.log(messageInput.value);
  closeModal();
});
