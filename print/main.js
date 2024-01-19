import "./style.css";
import { items } from "../components/constants.js";
import { getData } from "../components/getData.js";
import { drawGrid } from "../components/drawGrid.js";

document.querySelector("#print").innerHTML = `
<div class="flex">
  <label>Select Date:
    <input type="date" id="dateselect">
  </label>
</div>
<div class="flex">

  <div id="vert-header">
    <div class="vheader">Date:</div>
    <div class="vheader">Time:</div>
    ${items
    .map((item) => `<div class="vheader" id="header-${item}">${item}</div>`)
    .join("")}
  </div>
  <div id="grid"></div>
</div>
`;

getData(0).then((res) => {
  drawGrid(res, 0);
});

document.getElementById("dateselect").addEventListener("change", (e) => {
  window.location.href =
    window.location.origin + "/print/?date=" + e.target.value;
});
