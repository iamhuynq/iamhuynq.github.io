function createEditableText(key) {
  const svgNS = "http://www.w3.org/2000/svg";
  const text = document.createElementNS(svgNS, "text");
  text.setAttribute("x", 400); // Center of the SVG width
  text.setAttribute("y", 300); // Center of the SVG height
  text.setAttribute("fill", "#000000");
  text.setAttribute("font-size", "20");
  text.setAttribute("text-anchor", "middle"); // Center alignment
  text.setAttribute("alignment-baseline", "middle");
  text.setAttribute("cursor", "pointer");
  text.setAttribute("data-key", key);
  text.textContent = "text";

  const updateComponent = (props) => {
    window.components = window.components.map((comp) => {
      if (comp.key !== key) return comp;
      return {
        ...comp,
        ...props
      };
    });
  };

  const editZone = document.getElementById("editZone");

  // Make the text selectable
  text.addEventListener("mousedown", function () {
    // text.setAttribute("stroke", "blue");
    // text.setAttribute("stroke-width", 1);
    text.setAttribute("cursor", "move");
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
      updateComponent({
        x: newX,
        y: newY
      })
      // Update tspans
      const tspans = text.getElementsByTagName("tspan");
      for (let i = 0; i < tspans.length; i++) {
        tspans[i].setAttribute("x", newX);
      }
    }

    function mouseUpHandler() {
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
      text.setAttribute("cursor", "pointer");
      text.setAttribute("stroke", "none");
    }

    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);

    // Prevent default behavior to avoid text selection while dragging
    e.preventDefault();
  });

  editZone.appendChild(text);
}

export { createEditableText };
