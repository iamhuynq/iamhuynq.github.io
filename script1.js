let selectedDiv = null;

document
  .getElementById("createDiv")
  .addEventListener("click", createEditableDiv);
document.getElementById("applyText").addEventListener("click", applyTextToDiv);

function createEditableDiv() {
  const newDiv = document.createElement("div");
  newDiv.classList.add("editable-div");
  newDiv.style.top = "10px";
  newDiv.style.left = "10px";

  // Create and append resize handle
  const resizeHandle = document.createElement("div");
  resizeHandle.classList.add("resize-handle");
  newDiv.appendChild(resizeHandle);

  const editZone = document.getElementById("editZone");
  const keepRatioCheckbox = document.getElementById("keepRatio");

  // Make the div selectable
  newDiv.addEventListener("click", function () {
    if (selectedDiv) {
      selectedDiv.style.border = "1px solid #000";
    }
    selectedDiv = newDiv;
    newDiv.style.border = "2px solid #007BFF";
  });

  // Make the div draggable
  newDiv.addEventListener("mousedown", function (e) {
    if (e.target !== resizeHandle) {
      const startX = e.clientX;
      const startY = e.clientY;
      const initialTop = parseInt(window.getComputedStyle(newDiv).top);
      const initialLeft = parseInt(window.getComputedStyle(newDiv).left);

      function mouseMoveHandler(e) {
        let newTop = initialTop + (e.clientY - startY);
        let newLeft = initialLeft + (e.clientX - startX);

        // Boundary checks
        if (newTop < 0) newTop = 0;
        if (newLeft < 0) newLeft = 0;
        if (newTop + newDiv.offsetHeight > editZone.clientHeight)
          newTop = editZone.clientHeight - newDiv.offsetHeight;
        if (newLeft + newDiv.offsetWidth > editZone.clientWidth)
          newLeft = editZone.clientWidth - newDiv.offsetWidth;

        newDiv.style.top = `${newTop}px`;
        newDiv.style.left = `${newLeft}px`;
      }

      function mouseUpHandler() {
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);
      }

      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);

      // Prevent default behavior to avoid text selection while dragging
      e.preventDefault();
    }
  });

  // Make the div resizable
  resizeHandle.addEventListener("mousedown", function (e) {
    e.stopPropagation(); // Prevent triggering the parent mousedown event

    const startX = e.clientX;
    const startY = e.clientY;
    const initialWidth = parseInt(window.getComputedStyle(newDiv).width);
    const initialHeight = parseInt(window.getComputedStyle(newDiv).height);
    const aspectRatio = initialWidth / initialHeight;

    function mouseMoveHandler(e) {
      let newWidth = initialWidth + (e.clientX - startX);
      let newHeight = initialHeight + (e.clientY - startY);

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
      if (newWidth + newDiv.offsetLeft > editZone.clientWidth)
        newWidth = editZone.clientWidth - newDiv.offsetLeft;
      if (newHeight + newDiv.offsetTop > editZone.clientHeight)
        newHeight = editZone.clientHeight - newDiv.offsetTop;

      newDiv.style.width = `${newWidth}px`;
      newDiv.style.height = `${newHeight}px`;
    }

    function mouseUpHandler() {
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
    }

    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);

    // Prevent default behavior to avoid text selection while resizing
    e.preventDefault();
  });

  editZone.appendChild(newDiv);
}

function applyTextToDiv() {
  if (selectedDiv) {
    const inputText = document.getElementById("inputText").value;
    const inputColor = document.getElementById("inputColor").value;
    const inputFontSize = document.getElementById("inputFontSize").value;

    // Clear the div's content
    selectedDiv.innerHTML = "";

    // Add the new text
    const textNode = document.createElement("div");
    textNode.innerText = inputText;
    textNode.style.color = inputColor;
    textNode.style.fontSize = inputFontSize + "px";
    selectedDiv.appendChild(textNode);

    // Re-add the resize handle
    const resizeHandle = document.createElement("div");
    resizeHandle.classList.add("resize-handle");
    selectedDiv.appendChild(resizeHandle);

    // Re-attach the resize event listener
    resizeHandle.addEventListener("mousedown", function (e) {
      e.stopPropagation(); // Prevent triggering the parent mousedown event

      const startX = e.clientX;
      const startY = e.clientY;
      const initialWidth = parseInt(window.getComputedStyle(selectedDiv).width);
      const initialHeight = parseInt(
        window.getComputedStyle(selectedDiv).height
      );
      const aspectRatio = initialWidth / initialHeight;

      function mouseMoveHandler(e) {
        let newWidth = initialWidth + (e.clientX - startX);
        let newHeight = initialHeight + (e.clientY - startY);

        // Maintain aspect ratio if the checkbox is checked
        if (document.getElementById("keepRatio").checked) {
          if (newWidth / aspectRatio <= newHeight) {
            newHeight = newWidth / aspectRatio;
          } else {
            newWidth = newHeight * aspectRatio;
          }
        }

        // Minimum size check
        if (newWidth < 50) {
          newWidth = 50;
          if (document.getElementById("keepRatio").checked) {
            newHeight = newWidth / aspectRatio;
          }
        }
        if (newHeight < 50) {
          newHeight = 50;
          if (document.getElementById("keepRatio").checked) {
            newWidth = newHeight * aspectRatio;
          }
        }

        // Boundary checks
        if (
          newWidth + selectedDiv.offsetLeft >
          document.getElementById("editZone").clientWidth
        )
          newWidth =
            document.getElementById("editZone").clientWidth -
            selectedDiv.offsetLeft;
        if (
          newHeight + selectedDiv.offsetTop >
          document.getElementById("editZone").clientHeight
        )
          newHeight =
            document.getElementById("editZone").clientHeight -
            selectedDiv.offsetTop;

        selectedDiv.style.width = `${newWidth}px`;
        selectedDiv.style.height = `${newHeight}px`;
      }

      function mouseUpHandler() {
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);
      }

      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);

      // Prevent default behavior to avoid text selection while resizing
      e.preventDefault();
    });
  } else {
    alert("Please select a div to apply the text.");
  }
}
