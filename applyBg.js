function applyBackground() {
  const bgImageUrl = document.getElementById("bgImageUrl").value;
  const editZone = document.getElementById("editZone");
  console.log("editZone.clientWidth", editZone.clientWidth);
  const svgNS = "http://www.w3.org/2000/svg";

  // Remove existing background image if any
  const existingBgImage = document.getElementById("bgImage");
  if (existingBgImage) {
    existingBgImage.remove();
  }

  // Create and append new background image
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

export { applyBackground };
