import "./style.css";
import { getData } from "./components/getData.js";
import { drawGrid } from "./components/drawGrid.js";
import { drawTable } from "./components/drawTable.js";
import { getStatus } from "./components/getStatus.js";
import { addEvent, editEvent } from "./components/events.js";
import { items } from "./components/constants.js";

async function draw() {
  const data = await getData(3);
  return data;
}

// Draw static elements
document.querySelector("#app").innerHTML = `
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
<form name="newevent" id="newevent">
  <label>Item:<select name="item">
    ${items.map((item) => `<option value="${item}">${item}</option>`).join("")}
  </select></label>
  <label>Event:<select name="type">
    <option value="CIP">CIP</option>
    <option value="SB">SB Bio</option>
    <option value="VEGE">VEGE</option>
    <option value="ESL">ESL</option>
  </select></label>
  <label>Date:
    <input type="date" id="today" name="date">
  </label>
  <label>Time:
    <input type="number" data-maxlength="2" min="0" max="24" oninput="this.value=this.value.slice(0, this.dataset.maxlength)" name="time" id="time" value="00">
</label>
  <label>Status:
    <select name="status">
      <option value="completed">Completed</option>
      <option value="scheduled">Scheduled</option>
    </select>
  </label>
  <button type="submit">Add Event</button>
</form>
<div class="flex data-table">
  <table id="data">
  </table>
</div>
<div class="modal-backdrop modal">
  <div class="modal-window modal">
  <form name="editevent" class="editevent-form" id="modal-form">
  <input type="hidden" name="id" class="modal-id">
  <select name="item" class="modal-item" >
    ${items.map((i) => `<option value="${i}">${i}</option>`).join("")}
    </select>
  <select name="type" class="modal-type">
    <option value="CIP">CIP</option>
    <option value="SB">SB Bio</option>
    <option value="VEGE">VEGE</option>
    <option value="ESL">ESL</option>
  </select>
  <input type="text" name="date" class="modal-date">
  <select name="status" class="modal-status">
    <option value="completed">Completed</option>
    <option value="scheduled">Scheduled</option>
  </select>
  <button type="submit">Save</button>
    </form>
  </div>
</div>
`;

window.addEventListener("load", () => {
  draw().then((res) => {
    drawGrid(res, 3);
    drawTable(res);
    getStatus();
  });
});

// Set default date to today
document.getElementById("today").valueAsDate = new Date();

// Add event listeners for modal
document.getElementById("newevent").addEventListener("submit", addEvent);
const modalBack = document.querySelector(".modal-backdrop");
modalBack.addEventListener("click", (event) => {
  if (modalBack !== event.target) return;
  document.querySelectorAll(".modal").forEach((el) => {
    el.style.visibility = "hidden";
  });
});

// Event listeners for table data
document.querySelector(".editevent-form").addEventListener("submit", (e) => {
  if (!new FormData(e.target).get("id")) {
    addEvent(e);
  } else {
    editEvent(e);
  }
});

// change data based on date selection
document.getElementById("dateselect").addEventListener("change", (e) => {
  window.location.href = window.location.origin + "?date=" + e.target.value;
});
