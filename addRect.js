function createResizableRect(key) {
  const svgNS = "http://www.w3.org/2000/svg";
  const rect = document.createElementNS(svgNS, "rect");
  rect.setAttribute("x", 50);
  rect.setAttribute("y", 50);
  rect.setAttribute("width", 100);
  rect.setAttribute("height", 100);
  rect.setAttribute("fill", "transparent");
  rect.setAttribute("stroke", "black");
  rect.setAttribute("stroke-width", 1);
  rect.setAttribute("data-key", key);

  const clipPath = document.createElementNS(svgNS, "clipPath");
  clipPath.setAttribute("id", `clipPath-${key}`);
  const rectClip = document.createElementNS(svgNS, "rect");
  rectClip.setAttribute("x", 50);
  rectClip.setAttribute("y", 50);
  rectClip.setAttribute("width", 100);
  rectClip.setAttribute("height", 100);
  clipPath.appendChild(rectClip);

  const editZone = document.getElementById("editZone");
  $("#editZone").find("defs").append(clipPath);

  // Add drag handles to the rectangle
  rect.addEventListener("mousedown", startDrag);

  // Create a small circle to use as a resize handle
  const handle = document.createElementNS(svgNS, "circle");
  handle.setAttribute("cx", 150); // Initial position
  handle.setAttribute("cy", 150); // Initial position
  handle.setAttribute("r", 5);
  handle.setAttribute("fill", "blue");
  handle.setAttribute("cursor", "nwse-resize");

  handle.addEventListener("mousedown", startResize);

  editZone.appendChild(rect);
  editZone.appendChild(handle);

  // To ensure the handle stays correctly positioned
  function updateHandlePosition() {
    handle.setAttribute(
      "cx",
      parseFloat(rect.getAttribute("x")) +
        parseFloat(rect.getAttribute("width"))
    );
    handle.setAttribute(
      "cy",
      parseFloat(rect.getAttribute("y")) +
        parseFloat(rect.getAttribute("height"))
    );
  }

  // Update the clip path rect position and size
  function updateClipPath() {
    const x = rect.getAttribute("x");
    const y = rect.getAttribute("y");
    const width = rect.getAttribute("width");
    const height = rect.getAttribute("height");
    rectClip.setAttribute("x", x);
    rectClip.setAttribute("y", y);
    rectClip.setAttribute("width", width);
    rectClip.setAttribute("height", height);
    window.components = window.components.map(comp => {
      if (comp.key !== key) return comp;
      return {
        ...comp,
        x,
        y,
        width,
        height
      }
    })
  }

  // Call the function initially to position the handle
  updateHandlePosition();
  updateClipPath();

  function startDrag(e) {
    if (e.target.tagName !== "rect") return; // Only allow dragging on the rectangle itself

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
      if (newX + parseFloat(rect.getAttribute("width")) > editZone.clientWidth)
        newX = editZone.clientWidth - parseFloat(rect.getAttribute("width"));
      if (
        newY + parseFloat(rect.getAttribute("height")) >
        editZone.clientHeight
      )
        newY = editZone.clientHeight - parseFloat(rect.getAttribute("height"));

      rect.setAttribute("x", newX);
      rect.setAttribute("y", newY);

      // Update the position of the resize handle
      updateHandlePosition();
      updateClipPath();
    }

    function stopDrag() {
      document.removeEventListener("mousemove", drag);
      document.removeEventListener("mouseup", stopDrag);
    }

    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDrag);
  }

  function startResize(e) {
    e.stopPropagation(); // Prevent triggering the drag event
    const startX = e.clientX;
    const startY = e.clientY;
    const initialWidth = parseFloat(rect.getAttribute("width"));
    const initialHeight = parseFloat(rect.getAttribute("height"));
    const initialX = parseFloat(rect.getAttribute("x"));
    const initialY = parseFloat(rect.getAttribute("y"));

    function resize(e) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      let newWidth = initialWidth + dx;
      let newHeight = initialHeight + dy;

      // Minimum size check
      if (newWidth < 50) {
        newWidth = 50;
      }
      if (newHeight < 50) {
        newHeight = 50;
      }

      // Boundary checks
      if (newWidth + initialX > editZone.clientWidth) {
        newWidth = editZone.clientWidth - initialX;
      }
      if (newHeight + initialY > editZone.clientHeight) {
        newHeight = editZone.clientHeight - initialY;
      }

      rect.setAttribute("width", newWidth);
      rect.setAttribute("height", newHeight);

      // Update the position of the resize handle
      updateHandlePosition();
      updateClipPath();
    }

    function stopResize() {
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", stopResize);
    }

    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResize);
  }
}

export { createResizableRect };
