import { createEditableText } from "./createText.js";
import { createResizableRect } from "./addRect.js";
import { applyBackground } from "./applyBg.js";
import { addImage } from "./addImage.js";
window.components = [];

const listDefaultImages = [
  "https://kenh14cdn.com/203336854389633024/2024/6/26/1-17193601171381692950512.jpg",
  "https://kenh14cdn.com/203336854389633024/2024/6/26/photo-7-17193626403251221893688.jpg",
  "https://kenh14cdn.com/203336854389633024/2024/6/26/photo-1-17193626329341109394186.jpg",
];

$(document).ready(function () {
  document.getElementById("applyBg").addEventListener("click", applyBackground);

  document
    .getElementById("addComponentButton")
    .addEventListener("click", function() {
      const componentType = document.getElementById("componentType").value;
      let comp = null;
      const key = genId();
      if (componentType == "text") {
        createEditableText(key);
        comp = {
          text: "text",
          x: 400,
          y: 300,
          fontSize: 20,
          color: "#000000",
        };
      } else if (componentType === "image_upload") {
        createResizableRect(key);
        comp = {
          x: 100,
          y: 100,
          width: 200,
          height: 200,
        };
      }
      if (comp) {
        window.components.push({
          ...comp,
          key,
          component_type: componentType,
        });
      }
      renderListComponents();
    });
  const clientSvg = $("#client-svg svg");
  const listComponentsClient = $("#list-components-client");
  $("#render-client").on("click", function () {
    $("#client-svg").removeClass("hidden");
    clientSvg.empty();
    listComponentsClient.empty();
    const svgNS = "http://www.w3.org/2000/svg";
    const defs = document.createElementNS(svgNS, "defs");
    clientSvg.append(defs)
    if (window.bgImage) {
      const bgImage = document.createElementNS(svgNS, "image");
      bgImage.setAttribute("id", "bgImage");
      bgImage.setAttribute("href", window.bgImage);
      bgImage.setAttribute("x", 0);
      bgImage.setAttribute("y", 0);
      bgImage.setAttribute("width", clientSvg[0].clientWidth);
      bgImage.setAttribute("height", clientSvg[0].clientHeight);
      const defs = clientSvg[0].querySelector("defs");
      defs.insertAdjacentElement("afterend", bgImage);
    } 
    window.components.forEach(comp => {
      const type = comp.component_type;
      if (type == 'text') {
        const text = document.createElementNS(svgNS, "text");
        text.setAttribute("x", comp.x); // Center of the SVG width
        text.setAttribute("y", comp.y); // Center of the SVG height
        text.setAttribute("fill", comp.color);
        text.setAttribute("font-size", comp.fontSize);
        text.setAttribute("text-anchor", "middle"); // Center alignment
        text.setAttribute("alignment-baseline", "middle");
        text.setAttribute("cursor", "pointer");
        text.setAttribute("data-key", comp.key);
        const lines = comp.text.split("\n");
        if (lines.length > 1) {
          lines.forEach((line, index) => {
            if (!line) return;
            const tspan = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "tspan"
            );
            tspan.setAttribute("x", comp.x);
            tspan.setAttribute("dy", index === 0 ? "0" : "1.2em"); // Adjust dy for subsequent lines
            tspan.setAttribute("text-anchor", "middle"); // Center alignment
            tspan.textContent = line;
            text.appendChild(tspan);
          });
        } else {
          text.textContent = comp.text;
        }
        clientSvg.append(text);
        const child = $(`<label>
          Text: <textarea rows="4" cols="50">${comp.text}</textarea>
        </label>`);
        child.on('blur', 'textarea', function(e) {
          const value = e.target.value;
          const selectedText = clientSvg[0].querySelector(`[data-key="${comp.key}"]`);
          $(selectedText).empty()
          const lines = value.split("\n");
          if (lines.length > 1) {
            lines.forEach((line, index) => {
              if (!line) return;
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
          } else {
            selectedText.textContent = value;
          }
        })
        listComponentsClient.append(child);
      } else if (type == 'image_upload') {
        const svgNS = "http://www.w3.org/2000/svg";
        const clipPath = document.createElementNS(svgNS, "clipPath");
        clipPath.setAttribute("id", `clipPath-${comp.key}`);
        const rectClip = document.createElementNS(svgNS, "rect");
        rectClip.setAttribute("x", comp.x);
        rectClip.setAttribute("y", comp.y);
        rectClip.setAttribute("width", comp.width);
        rectClip.setAttribute("height", comp.height);
        clipPath.appendChild(rectClip);
        defs.append(clipPath);
        if (comp.defaultImage) {
          const { x, y, width, height, url } = comp.defaultImage;
          const img = document.createElementNS(svgNS, "image");
          img.setAttribute("href", url);
          img.setAttribute("x", x + width / 2 - 100); // Center the image horizontally
          img.setAttribute("y", y + height / 2 - 100); // Center the image vertically
          img.setAttribute("width", width); // Initial width
          img.setAttribute("height", height); // Initial height
          img.setAttribute("clip-path", `url(#clipPath-${comp.key})`);
          img.setAttribute("cursor", "pointer");
          img.setAttribute("data-key", comp.key);
          clientSvg.append(img);
        }
        const child = $(`<div>
          <div class="flex listDefaultImages">
            ${listDefaultImages.map((image) => `<img src="${image}"/>`)}
          </div>
        </div>`);
        listComponentsClient.append(child);
        child.on('click', 'img', function() {
          const imgUrl = $(this).attr("src");
          const clipPathId = `clipPath-${comp.key}`;
          let imageEl = clientSvg[0].querySelector(
            `[data-key="${comp.key}"]`
          );

          const img = imageEl || document.createElementNS(svgNS, "image");
          img.setAttribute("href", imgUrl);
          img.setAttribute(
            "x",
            parseFloat(comp.x) + parseFloat(comp.width) / 2 - 100
          ); // Center the image horizontally
          img.setAttribute(
            "y",
            parseFloat(comp.y) + parseFloat(comp.height) / 2 - 100
          ); // Center the image vertically
          img.setAttribute("width", 200); // Initial width
          img.setAttribute("height", 200); // Initial height
          img.setAttribute("clip-path", `url(#${clipPathId})`);
          img.setAttribute("cursor", "pointer");
          img.setAttribute("data-key", comp.key);

          if (!imageEl) clientSvg.append(img);
          img.addEventListener("click", () =>
            createWrapper(img, clientSvg[0])
          );
        })
      }
    })
  });
});



const genId = () => {
  var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  var uniqid = randLetter + Date.now();
  return uniqid;
};

const applyTextToSVGText = ({ componentKey, text, color, fontSize }) => {
  const selectedText = $("#editZone").find(`[data-key=${componentKey}]`)[0];
  if (selectedText && selectedText.tagName === "text") {
    // Clear existing tspans
    while (selectedText.firstChild) {
      selectedText.firstChild.remove();
    }

    // Create tspans for each line of text
    const lines = text.split("\n");
    if (lines.length > 1) {
      lines.forEach((line, index) => {
        if (!line) return;
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
    } else {
      selectedText.textContent = text;
    }

    selectedText.setAttribute("fill", color);
    selectedText.setAttribute("font-size", fontSize);
  } else {
    alert("Please select a text element to apply the text.");
  }
};

const renderListComponents = () => {
  const container = $("#list-components");
  container.empty();
  window.components.forEach((component, index) => {
    const componentKey = component.key;
    const componentType = component.component_type;
    const compEl = $(`<div class="component-section">
      <strong>${index + 1}. Component type ${componentType}</strong>
    </div>`);
    let child = null;
    if (componentType == "text") {
      child = $(`<div>
        <div>
        <label>
          Default text: <textarea rows="4" cols="50">${component.text}</textarea>
        </label>
        </div>
        <div>
          <label> Color: <input type="color" value="${component.color}" /> </label>
        </div>
        <div>
          <label>
            Font Size: <input type="number" min="8" max="72" value="${component.fontSize}" />
          </label>
        </div>
        <button>Apply Text</button>
      </div>`);
      child.on("click", "button", function () {
        const text = child.find("textarea").val();
        const color = child.find('input[type="color"]').val();
        const fontSize = child.find('input[type="number"]').val();
        window.components = window.components.map((comp) => {
          if (comp.key !== componentKey) return comp;
          return {
            ...comp,
            text,
            color,
            fontSize
          };
        });
        applyTextToSVGText({ componentKey, text, color, fontSize });
      });
    } else if (componentType == "image_upload") {
      child = $(`<div>
        <div>
          <label>
            Default image: <input type="text">${
              component.default_url || ""
            }</input>
          </label>
        </div>
        <button>Apply Image</button>
      </div>`);
      child.on("click", "button", function () {
        const imageUrl = child.find("input").val();
        addImage({ componentKey, imageUrl });
      });
    }
    if (child) compEl.append(child);
    container.append(compEl);
  });
};
