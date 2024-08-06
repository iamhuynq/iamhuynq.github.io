import { createEditableText } from "./createText.js";
import { createResizableRect } from "./addRect.js";
import { applyBackground } from "./applyBg.js";
import { addImage } from "./addImage.js";
import { uploadImage } from "./uploadImage.js";
const fonts = [
  {
    id: 1,
    name: "Hello Najwa",
    url: "https://d7y19uepu1s8k.cloudfront.net/8/storage/personalizedDesign/fonts/hello_najwa/hello_najwa.css",
  },
  {
    id: 2,
    name: "sweatpants",
    url: "https://d1wgzwi9vgtgm8.cloudfront.net/88/storage/personalizedDesign/fonts/sweatpants/sweatpants.css",
  },
];
const svgNS = "http://www.w3.org/2000/svg";
window.components = [];

const listDefaultImages = [
  "https://kenh14cdn.com/203336854389633024/2024/6/26/1-17193601171381692950512.jpg",
  "https://kenh14cdn.com/203336854389633024/2024/6/26/photo-7-17193626403251221893688.jpg",
  "https://kenh14cdn.com/203336854389633024/2024/6/26/photo-1-17193626329341109394186.jpg",
];

$(document).ready(function () {
  applyBackground();
  document
    .getElementById("addComponentButton")
    .addEventListener("click", function () {
      const componentType = document.getElementById("componentType").value;
      let comp = null;
      const key = genId();
      if (componentType == "text") {
        createEditableText(key);
        comp = {
          text: "text",
          x: 400,
          y: 300,
          fontSize: 60,
          color: "#000000",
          fontFamily: "",
          title: "Title",
        };
      } else if (componentType === "image_upload") {
        createResizableRect(key);
        comp = {
          x: 100,
          y: 100,
          width: 200,
          height: 200,
          title: "Title",
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
    const defs = document.createElementNS(svgNS, "defs");
    clientSvg.append(defs);
    if (window.bgImage) {
      const bgImage = document.createElementNS(svgNS, "image");
      bgImage.setAttribute("id", "bgImage");
      bgImage.setAttribute("href", window.bgImage);
      bgImage.setAttribute("x", 0);
      bgImage.setAttribute("y", 0);
      bgImage.setAttribute("width", "100%");
      bgImage.setAttribute("height", "100%");
      const defs = clientSvg[0].querySelector("defs");
      defs.insertAdjacentElement("afterend", bgImage);
    }
    window.components.forEach((comp) => {
      const type = comp.component_type;
      if (type == "text") {
        const text = document.createElementNS(svgNS, "text");
        text.setAttribute("x", comp.x); // Center of the SVG width
        text.setAttribute("y", comp.y); // Center of the SVG height
        text.setAttribute("fill", comp.color);
        text.setAttribute("font-size", comp.fontSize);
        text.setAttribute("text-anchor", "middle"); // Center alignment
        text.setAttribute("alignment-baseline", "middle");
        text.setAttribute("cursor", "pointer");
        text.setAttribute("data-key", comp.key);
        // Create tspans for each line of text
        const textContent = comp.text;
        const lines = textContent.split("\n");
        if (lines.length > 1) {
          lines.forEach((line, index) => {
            if (!line) return;
            const tspan = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "tspan"
            );
            tspan.setAttribute("x", text.getAttribute("x"));
            tspan.setAttribute("dy", index === 0 ? "0" : "1.2em"); // Adjust dy for subsequent lines
            tspan.setAttribute("text-anchor", "middle"); // Center alignment
            tspan.textContent = line;
            text.appendChild(tspan);
          });
        } else {
          text.textContent = textContent;
        }
        const fontFamily = comp.fontFamily;
        if (fontFamily) {
          const font = fonts.find((i) => i.id == fontFamily);
          const style = document.createElementNS(svgNS, "style");
          style.setAttribute("type", "text/css");
          style.setAttribute("id", "importedStyle");
          style.textContent = `@import url(${font.url});`;
          defs.append(style);
          text.setAttribute("font-family", font.name);
        } else {
          text.setAttribute("font-family", "");
        }
        clientSvg.append(text);
        const child = $(`<div>
        <label>
          <strong>${comp.title}</strong>
          <textarea rows="4" cols="50">${comp.text}</textarea>
        </label></div>`);
        child.on("blur", "textarea", function (e) {
          const value = e.target.value;
          const selectedText = clientSvg[0].querySelector(
            `[data-key="${comp.key}"]`
          );
          $(selectedText).empty();
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
        });
        listComponentsClient.append(child);
      } else if (type == "image_upload") {
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
          img.setAttribute("x", x); // Center the image horizontally
          img.setAttribute("y", y); // Center the image vertically
          img.setAttribute("width", width); // Initial width
          img.setAttribute("height", height); // Initial height
          img.setAttribute("clip-path", `url(#clipPath-${comp.key})`);
          img.setAttribute("cursor", "pointer");
          img.setAttribute("data-key", comp.key);
          clientSvg.append(img);
        }
        const child = $(`<div>
          <strong>${comp.title}</strong>
          <div class="flex listDefaultImages">
            ${[].map((image) => `<img src="${image}"/>`)}
          </div>
          <label>Please choose image:</label>
          <input type="file"/>
        </div>`);
        function success(res) {
          if (!res.image) return;
          const imgUrl = res.image.url;
          const clipPathId = `clipPath-${comp.key}`;
          let imageEl = clientSvg[0].querySelector(`[data-key="${comp.key}"]`);

          const img = imageEl || document.createElementNS(svgNS, "image");
          const imgLoader = new Image();
          imgLoader.src = imgUrl;
          imgLoader.onload = function () {
            const aspectRatio = imgLoader.width / imgLoader.height;
            const initialWidth = 200;
            const initialHeight = initialWidth / aspectRatio;
            img.setAttribute("href", imgUrl);
            img.setAttribute(
              "x",
              parseFloat(comp.x) + parseFloat(comp.width) / 2 - initialWidth / 2
            ); // Center the image horizontally
            img.setAttribute(
              "y",
              parseFloat(comp.y) +
                parseFloat(comp.height) / 2 -
                initialHeight / 2
            ); // Center the image vertically
            img.setAttribute("width", initialWidth); // Initial width
            img.setAttribute("height", initialHeight); // Initial height
            img.setAttribute("clip-path", `url(#${clipPathId})`);
            img.setAttribute("cursor", "pointer");
            img.setAttribute("data-key", comp.key);

            if (!imageEl) clientSvg.append(img);
            img.addEventListener("click", () =>
              createWrapper(img, clientSvg[0])
            );
          };
        }
        child.on("change", "input", function () {
          const input = $(this);
          const file = input[0].files[0];
          uploadImage(file, success);
        });
        listComponentsClient.append(child);
      }
    });
  });
});

const genId = () => {
  var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  var uniqid = randLetter + Date.now();
  return uniqid;
};

const applyTextToSVGText = ({
  componentKey,
  text,
  color,
  fontSize,
  fontFamily,
}) => {
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
    if (fontFamily) {
      const font = fonts.find((i) => i.id == fontFamily);
      const style = document.createElementNS(svgNS, "style");
      style.setAttribute("type", "text/css");
      style.setAttribute("id", "importedStyle");
      style.textContent = `@import url(${font.url});`;
      const defs = $("#editZone").find("defs");
      defs.append(style);
      selectedText.setAttribute("font-family", font.name);
    } else {
      selectedText.setAttribute("font-family", "");
    }
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
      <div class="flex justify-between">
        <strong>${index + 1}. Component type ${componentType}</strong>
        <u class="pointer remove-component">Remove</u>
      </div>
    </div>`);
    compEl.on("click", ".remove-component", function () {
      const svgEl = $("#editZone").find(`[data-key='${componentKey}']`);
      if (svgEl.get(0).tagName === "rect") svgEl.next().remove();
      svgEl.remove();
      compEl.remove();
      window.components = window.components.filter(
        (comp) => comp.key !== componentKey
      );
      renderListComponents();
    });
    let child = null;
    if (componentType == "text") {
      child = $(`<div>
      <div>
      <label>
          Title: <input type="text" value="${component.title}"/>
        </label></div>
        <div>
        <label>
          Default text: <textarea rows="4" cols="50">${
            component.text
          }</textarea>
        </label>
        </div>
        <div>
          <label> Color: <input type="color" value="${
            component.color
          }" /> </label>
        </div>
        <div>
          <label>
            Font Size: <input type="number" min="8" max="72" value="${
              component.fontSize
            }" />
          </label>
        </div>
        <div>
          <select>
            <option value="">Select font</option>
            ${fonts.map(
              (font) => `<option value="${font.id}">${font.name}</option>`
            )}
          </select>
        </div>
        <button>Apply Text</button>
      </div>`);
      child.on("click", "button", function () {
        const text = child.find("textarea").val();
        const color = child.find('input[type="color"]').val();
        const fontSize = child.find('input[type="number"]').val();
        const fontFamily = child.find("select").val();
        const title = child.find('input[type="text"').val();
        applyTextToSVGText({
          componentKey,
          text,
          color,
          fontSize,
          fontFamily,
        });
        window.components = window.components.map((comp) => {
          if (comp.key !== componentKey) return comp;
          return {
            ...comp,
            color,
            fontSize,
            fontFamily,
            text,
            title,
          };
        });
      });
    } else if (componentType == "image_upload") {
      child = $(`<div>
        <label>
          Title: <input type="text" name="title" value="${component.title}"/>
        </label>
        <div>
          <label>
            Default image: <input type="file" name="image">${
              component.default_url || ""
            }</input>
          </label>
        </div>
        <button>Apply Image</button>
      </div>`);
      function success(res) {
        if (!res.image) return;
        const imageUrl = res.image.url;
        addImage({ componentKey, imageUrl });
      }
      child
        .on("click", "button", function () {
          const title = child.find("input[name='title']").val();
          window.components = window.components.map((comp) => {
            if (comp.key !== componentKey) return comp;
            return {
              ...comp,
              title,
            };
          });
        })
        .on("change", "input[name='image']", function () {
          const input = $(this);
          const file = input[0].files[0];
          uploadImage(file, success);
        });
    }
    if (child) compEl.append(child);
    container.append(compEl);
  });
};
