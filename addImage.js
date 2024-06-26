function addImage({ componentKey, imageUrl }) {
  const clipPathId = `clipPath-${componentKey}`;
  const svgNS = "http://www.w3.org/2000/svg";
  const editZone = document.getElementById("editZone");
  const clipRect = $(`#${clipPathId}`).find("rect")[0];
  const clipX = parseFloat(clipRect.getAttribute("x"));
  const clipY = parseFloat(clipRect.getAttribute("y"));
  const clipWidth = parseFloat(clipRect.getAttribute("width"));
  const clipHeight = parseFloat(clipRect.getAttribute("height"));

  const img = document.createElementNS(svgNS, "image");
  img.setAttribute("href", imageUrl);
  img.setAttribute("x", clipX + clipWidth / 2 - 100); // Center the image horizontally
  img.setAttribute("y", clipY + clipHeight / 2 - 100); // Center the image vertically
  img.setAttribute("width", 200); // Initial width
  img.setAttribute("height", 200); // Initial height
  img.setAttribute("clip-path", `url(#${clipPathId})`);
  img.setAttribute("cursor", "pointer");
  img.setAttribute("data-key", componentKey);
  window.components = window.components.map((comp) => {
    if (comp.key !== componentKey) return comp;
    return {
      ...comp,
      defaultImage: {
        url: imageUrl,
        x: clipX + clipWidth / 2 - 100,
        y: clipY + clipHeight / 2 - 100,
        width: 200,
        height: 200
      },
    };
  });

  const updateComponent = (props) => {
    window.components = window.components.map((comp) => {
      if (comp.key !== componentKey) return comp;
      return {
        ...comp,
        defaultImage: {
          ...comp.defaultImage,
          ...props,
        },
      };
    });
  }

  // Add click event listener to image to create the wrapper
  img.addEventListener("click", () =>
    createWrapper(img, editZone, updateComponent)
  );

  editZone.appendChild(img);
}

function createWrapper(img, editZone, updateComponent) {
  const svgNS = "http://www.w3.org/2000/svg";
  // Remove existing wrapper if any
  const existingWrapper = document.getElementById("imageWrapper");
  if (existingWrapper) {
    existingWrapper.remove();
  }

  // Create the wrapper group
  const wrapper = document.createElementNS(svgNS, "g");
  wrapper.setAttribute("id", "imageWrapper");
  wrapper.setAttribute("stroke", "blue");
  wrapper.setAttribute("stroke-dasharray", "4");
  wrapper.setAttribute("fill", "transparent");

  // Create a rect inside the wrapper
  const wrapperRect = document.createElementNS(svgNS, "rect");
  wrapperRect.setAttribute("x", img.getAttribute("x"));
  wrapperRect.setAttribute("y", img.getAttribute("y"));
  wrapperRect.setAttribute("width", img.getAttribute("width"));
  wrapperRect.setAttribute("height", img.getAttribute("height"));

  // Add four handle corners for resizing
  const handles = ["tl", "tr", "bl", "br"].map((pos) => {
    const handle = document.createElementNS(svgNS, "circle");
    handle.setAttribute("r", 5);
    handle.setAttribute("fill", "red");
    handle.setAttribute("cursor", "nwse-resize");
    handle.setAttribute("class", `resize-handle ${pos}`);
    return handle;
  });

  updateHandlePositions(wrapperRect, handles);

  wrapper.appendChild(wrapperRect);
  handles.forEach((handle) => wrapper.appendChild(handle));

  editZone.appendChild(wrapper);

  // Add event listeners for dragging and resizing
  wrapperRect.addEventListener("mousedown", (e) => startDrag(e, updateComponent));
  handles.forEach((handle) =>
    handle.addEventListener("mousedown", (e) => startResize(e, updateComponent))
  );

  // Add event listener to remove wrapper when clicking outside
  document.addEventListener("mousedown", removeWrapperOnClickOutside);

  function updateHandlePositions(rect, handles) {
    const x = parseFloat(rect.getAttribute("x"));
    const y = parseFloat(rect.getAttribute("y"));
    const width = parseFloat(rect.getAttribute("width"));
    const height = parseFloat(rect.getAttribute("height"));

    handles[0].setAttribute("cx", x);
    handles[0].setAttribute("cy", y); // Top-left
    handles[1].setAttribute("cx", x + width);
    handles[1].setAttribute("cy", y); // Top-right
    handles[2].setAttribute("cx", x);
    handles[2].setAttribute("cy", y + height); // Bottom-left
    handles[3].setAttribute("cx", x + width);
    handles[3].setAttribute("cy", y + height); // Bottom-right
  }

  function startDrag(e, updateComponent) {
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
      // if (newX < 0) newX = 0;
      // if (newY < 0) newY = 0;
      // if (
      //   newX + parseFloat(rect.getAttribute("width")) >
      //   editZone.clientWidth
      // )
      //   newX = editZone.clientWidth - parseFloat(rect.getAttribute("width"));
      // if (
      //   newY + parseFloat(rect.getAttribute("height")) >
      //   editZone.clientHeight
      // )
      //   newY =
      //     editZone.clientHeight - parseFloat(rect.getAttribute("height"));

      rect.setAttribute("x", newX);
      rect.setAttribute("y", newY);
      img.setAttribute("x", newX);
      img.setAttribute("y", newY);
      if (updateComponent) {
        updateComponent({
          x: newX,
          y: newY,
        });
      }
        

      // Update the position of the resize handles
      updateHandlePositions(rect, handles);
    }

    function stopDrag() {
      document.removeEventListener("mousemove", drag);
      document.removeEventListener("mouseup", stopDrag);
    }

    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDrag);
  }

  function startResize(e, updateComponent) {
    e.stopPropagation(); // Prevent triggering the drag event
    const handle = e.target;
    const rect = wrapperRect;
    const startX = e.clientX;
    const startY = e.clientY;
    const initialWidth = parseFloat(rect.getAttribute("width"));
    const initialHeight = parseFloat(rect.getAttribute("height"));
    const initialX = parseFloat(rect.getAttribute("x"));
    const initialY = parseFloat(rect.getAttribute("y"));

    function resize(e) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      let newWidth, newHeight;

      if (handle.classList.contains("tl")) {
        newWidth = initialWidth - dx;
        newHeight = initialHeight - dy;
        rect.setAttribute("x", initialX + dx);
        rect.setAttribute("y", initialY + dy);
        img.setAttribute("x", initialX + dx);
        img.setAttribute("y", initialY + dy);
      } else if (handle.classList.contains("tr")) {
        newWidth = initialWidth + dx;
        newHeight = initialHeight - dy;
        rect.setAttribute("y", initialY + dy);
        img.setAttribute("y", initialY + dy);
      } else if (handle.classList.contains("bl")) {
        newWidth = initialWidth - dx;
        newHeight = initialHeight + dy;
        rect.setAttribute("x", initialX + dx);
        img.setAttribute("x", initialX + dx);
      } else if (handle.classList.contains("br")) {
        newWidth = initialWidth + dx;
        newHeight = initialHeight + dy;
      }

      // Minimum size check
      if (newWidth < 50) {
        newWidth = 50;
      }
      if (newHeight < 50) {
        newHeight = 50;
      }

      // Boundary checks
      // if (newWidth + initialX > editZone.clientWidth) {
      //   newWidth = editZone.clientWidth - initialX;
      // }
      // if (newHeight + initialY > editZone.clientHeight) {
      //   newHeight = editZone.clientHeight - initialY;
      // }

      rect.setAttribute("width", newWidth);
      rect.setAttribute("height", newHeight);
      img.setAttribute("width", newWidth);
      img.setAttribute("height", newHeight);
      if (updateComponent) {
        updateComponent({
          width: newWidth,
          height: newHeight,
        });
      }

      // Update the position of the resize handles
      updateHandlePositions(rect, handles);
    }

    function stopResize() {
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", stopResize);
    }

    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResize);
  }
  function removeWrapperOnClickOutside(e) {
    if (!wrapper.contains(e.target) && e.target !== img) {
      wrapper.remove();
      document.removeEventListener("mousedown", removeWrapperOnClickOutside);
    }
  }
}

window.createWrapper = createWrapper;

export { addImage };
