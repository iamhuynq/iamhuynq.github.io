let selectedText = null;

document
  .getElementById("createText")
  .addEventListener("click", createEditableText);
document
  .getElementById("applyText")
  .addEventListener("click", applyTextToSVGText);
document
  .getElementById("addRectBtn")
  .addEventListener("click", createResizableRect);
document.getElementById("applyBg").addEventListener("click", applyBackground);

function createEditableText() {
  const svgNS = "http://www.w3.org/2000/svg";
  const text = document.createElementNS(svgNS, "text");
  text.setAttribute("x", 400); // Center of the SVG width
  text.setAttribute("y", 300); // Center of the SVG height
  text.setAttribute("fill", "black");
  text.setAttribute("font-size", "20");
  text.setAttribute("text-anchor", "middle"); // Center alignment
  text.textContent = "sadas";

  const editZone = document.getElementById("editZone");

  // Make the text selectable
  text.addEventListener("click", function () {
    if (selectedText) {
      selectedText.setAttribute("stroke", "none");
    }
    selectedText = text;
    text.setAttribute("stroke", "blue");
    text.setAttribute("stroke-width", 1);
  });

  // Make the text draggable
  text.addEventListener("mousedown", function (e) {
    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = parseFloat(text.getAttribute("x"));
    const initialY = parseFloat(text.getAttribute("y"));

    function mouseMoveHandler(e) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      let newX = initialX + dx;
      let newY = initialY + dy;

      // Boundary checks
      if (newX < 0) newX = 0;
      if (newY < 0) newY = 0;
      if (newX > editZone.clientWidth) newX = editZone.clientWidth;
      if (newY > editZone.clientHeight) newY = editZone.clientHeight;

      text.setAttribute("x", newX);
      text.setAttribute("y", newY);

      // Update tspans
      const tspans = text.getElementsByTagName("tspan");
      for (let i = 0; i < tspans.length; i++) {
        tspans[i].setAttribute("x", newX);
      }
    }

    function mouseUpHandler() {
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
    }

    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);

    // Prevent default behavior to avoid text selection while dragging
    e.preventDefault();
  });

  editZone.appendChild(text);
}

function applyTextToSVGText() {
  if (selectedText && selectedText.tagName === "text") {
    const inputText = document.getElementById("inputText").value;
    const inputColor = document.getElementById("inputColor").value;
    const inputFontSize = document.getElementById("inputFontSize").value;

    // Clear existing tspans
    while (selectedText.firstChild) {
      selectedText.firstChild.remove();
    }

    // Create tspans for each line of text
    const lines = inputText.split("\n");
    lines.forEach((line, index) => {
      const tspan = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "tspan"
      );
      tspan.setAttribute("x", selectedText.getAttribute("x"));
      tspan.setAttribute("dy", index === 0 ? "0" : "1.2em"); // Adjust dy for subsequent lines
      tspan.setAttribute("text-anchor", "middle"); // Center alignment
      tspan.textContent = line;
      selectedText.appendChild(tspan);
    });

    selectedText.setAttribute("fill", inputColor);
    selectedText.setAttribute("font-size", inputFontSize);
  } else {
    alert("Please select a text element to apply the text.");
  }
}

function createResizableRect() {
  const svgNS = "http://www.w3.org/2000/svg";
  const rect = document.createElementNS(svgNS, "rect");
  rect.setAttribute("x", 50);
  rect.setAttribute("y", 50);
  rect.setAttribute("width", 100);
  rect.setAttribute("height", 100);
  rect.setAttribute("fill", "white");
  rect.setAttribute("stroke", "black");
  rect.setAttribute("stroke-width", 1);

  const editZone = document.getElementById("editZone");

  // Add drag and resize handles to the rectangle
  rect.addEventListener("mousedown", startDrag);
  rect.addEventListener("mouseup", endDrag);
  rect.addEventListener("dblclick", startResize);

  editZone.appendChild(rect);
}

function startDrag(e) {
  console.log("DAD");
  const rect = e.target;
  const startX = e.clientX;
  const startY = e.clientY;
  const initialX = parseFloat(rect.getAttribute("x"));
  const initialY = parseFloat(rect.getAttribute("y"));

  function drag(e) {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    let newX = initialX + dx;
    let newY = initialY + dy;

    // Boundary checks
    if (newX < 0) newX = 0;
    if (newY < 0) newY = 0;
    if (
      newX + parseFloat(rect.getAttribute("width")) >
      rect.parentNode.clientWidth
    )
      newX =
        rect.parentNode.clientWidth - parseFloat(rect.getAttribute("width"));
    if (
      newY + parseFloat(rect.getAttribute("height")) >
      rect.parentNode.clientHeight
    )
      newY =
        rect.parentNode.clientHeight - parseFloat(rect.getAttribute("height"));

    rect.setAttribute("x", newX);
    rect.setAttribute("y", newY);
  }

  function stopDrag() {
    document.removeEventListener("mousemove", drag);
    document.removeEventListener("mouseup", stopDrag);
  }

  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", stopDrag);
}

function endDrag(e) {
  document.removeEventListener("mousemove", startDrag);
  document.removeEventListener("mouseup", endDrag);
}

function startResize(e) {
  const rect = e.target;
  const startX = e.clientX;
  const startY = e.clientY;
  const initialWidth = parseFloat(rect.getAttribute("width"));
  const initialHeight = parseFloat(rect.getAttribute("height"));
  const aspectRatio = initialWidth / initialHeight;
  const keepRatioCheckbox = document.getElementById("keepRatio");

  function resize(e) {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    let newWidth = initialWidth + dx;
    let newHeight = initialHeight + dy;

    // Maintain aspect ratio if the checkbox is checked
    if (keepRatioCheckbox.checked) {
      if (newWidth / aspectRatio <= newHeight) {
        newHeight = newWidth / aspectRatio;
      } else {
        newWidth = newHeight * aspectRatio;
      }
    }

    // Minimum size check
    if (newWidth < 50) {
      newWidth = 50;
      if (keepRatioCheckbox.checked) {
        newHeight = newWidth / aspectRatio;
      }
    }
    if (newHeight < 50) {
      newHeight = 50;
      if (keepRatioCheckbox.checked) {
        newWidth = newHeight * aspectRatio;
      }
    }

    // Boundary checks
    if (
      newWidth + parseFloat(rect.getAttribute("x")) >
      rect.parentNode.clientWidth
    ) {
      newWidth =
        rect.parentNode.clientWidth - parseFloat(rect.getAttribute("x"));
      if (keepRatioCheckbox.checked) {
        newHeight = newWidth / aspectRatio;
      }
    }
    if (
      newHeight + parseFloat(rect.getAttribute("y")) >
      rect.parentNode.clientHeight
    ) {
      newHeight =
        rect.parentNode.clientHeight - parseFloat(rect.getAttribute("y"));
      if (keepRatioCheckbox.checked) {
        newWidth = newHeight * aspectRatio;
      }
    }

    rect.setAttribute("width", newWidth);
    rect.setAttribute("height", newHeight);
  }

  function stopResize() {
    document.removeEventListener("mousemove", resize);
    document.removeEventListener("mouseup", stopResize);
  }

  document.addEventListener("mousemove", resize);
  document.addEventListener("mouseup", stopResize);
}

function applyBackground() {
  const bgImageUrl = document.getElementById("bgImageUrl").value;
  const editZone = document.getElementById("editZone");
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
    bgImage.setAttribute("width", editZone.clientWidth);
    bgImage.setAttribute("height", editZone.clientHeight);
    editZone.insertBefore(bgImage, editZone.firstChild);
  } else {
    alert("Please enter a valid image URL.");
  }
}
