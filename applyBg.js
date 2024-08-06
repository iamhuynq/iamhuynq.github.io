import { uploadImage } from "./uploadImage.js";

function success(res) {
  if (!res.image) return;
  const bgImageUrl = res.image.url;
  const editZone = document.getElementById("editZone");
  const svgNS = "http://www.w3.org/2000/svg";

  // Remove existing background image if any
  const existingBgImage = document.getElementById("bgImage");
  if (existingBgImage) {
    existingBgImage.remove();
  }

  if (bgImageUrl) {
    const bgImage = document.createElementNS(svgNS, "image");
    bgImage.setAttribute("id", "bgImage");
    bgImage.setAttribute("href", bgImageUrl);
    bgImage.setAttribute("x", 0);
    bgImage.setAttribute("y", 0);
    bgImage.setAttribute("width", "100%");
    bgImage.setAttribute("height", "100%");
    const defs = editZone.querySelector("defs");
    defs.insertAdjacentElement("afterend", bgImage);
    window.bgImage = bgImageUrl;
  } else {
    alert("Please enter a valid image URL.");
  }
}

function applyBackground() {
  const fileInput = $("#bgImageUrl");
  fileInput.on("change", function () {
    const file = fileInput[0].files[0];
    uploadImage(file, success);
  });
}

export { applyBackground };
