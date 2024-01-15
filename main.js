import "./style.css";
import { client } from "./components/client.js";

const items = [
  "chiller",
  "2100",
  "3200",
  "2300",
  "3300",
  "2200",
  "3100",
  "2000",
  "3000",
  "4000",
  "filler2",
  "filler3",
  "filler4",
  "filler5",
  "fruitlines",
  "hoses",
];

function toggleEditable(e) {
  const row = e.target.parentNode.parentNode;
  const id = row.dataset.id;
  const item = row.querySelector(".item").innerText;
  const type = row.querySelector(".type").innerText;
  const date = row.querySelector(".date").innerText;
  const status = row.querySelector(".status").innerText;

  row.innerHTML = `
<td colspan="5">
  <form name="editevent" class="editevent-form">
  <input type="hidden" name="id" value="${id}">
  <select name="item" class="item"">
    ${items
      .map(
        (i) =>
          `<option value="${i}" ${item === i ? "selected" : ""}>${i}</option>`,
      )
      .join("")}
    </select>
  <select name="type" class="type">
    <option value="CIP" ${type === "CIP" ? "selected" : ""}>CIP</option>
    <option value="SB" ${type === "SB" ? "selected" : ""}>SB Bio</option>
    <option value="VEGE" ${type === "VEGE" ? "selected" : ""}>VEGE</option>
    <option value="ESL" ${type === "ESL" ? "selected" : ""}>ESL</option>
  </select>
  <input type="text" name="date" value="${date}">
  <select name="status" class="status" value="${status}">
    <option value="completed" ${status === "completed" ? "selected" : ""
    }>Completed</option>
    <option value="scheduled" ${status === "scheduled" ? "selected" : ""
    }>Scheduled</option>
  </select>
  <button type="submit">Save</button>
    </form>
</td>
`;
  document
    .querySelector(".editevent-form")
    .addEventListener("submit", editEvent);
}

function loadModal(e) {
  const id = e.target.dataset.id;
  const item = e.target.dataset.item;
  const type = e.target.dataset.type;
  const date = e.target.dataset.date;
  const status = e.target.dataset.status;

  const modalForm = document.getElementById("modal-form");
  modalForm.querySelector(".modal-id").value = id;
  modalForm.querySelector(".modal-item").value = item;
  modalForm.querySelector(".modal-type").value = type;
  modalForm.querySelector(".modal-date").value = date;
  modalForm.querySelector(".modal-status").value = status;
  //
  document.querySelectorAll(".modal").forEach((el) => {
    el.style.visibility = "visible";
  });
}

function createCell(iterator, event) {
  let eventItems = [];
  const evenOdd = Number(event.date.split("/")[1]) % 2 === 0 ? "even" : "odd";
  event.events.forEach((e) => eventItems.push(e.item));
  if (eventItems.includes(iterator)) {
    const eventDetails = event.events.find((e) => e.item === iterator);
    return `<div class="row event-marker ${eventDetails.status} ${eventDetails.type} ${evenOdd}"
data-id="${eventDetails.id}"
data-item="${eventDetails.item}"
data-type="${eventDetails.type}"
data-date="${eventDetails.date}"
data-status="${eventDetails.status}"
>${eventDetails.type}</div>`;
  } else {
    return `<div class="row ${evenOdd}"></div>`;
  }
}

async function getData() {
  const data = await client
    .execute("select * from events order by date desc limit 100")
    .then((response) => {
      const grid = document.getElementById("grid");
      const res = response.rows;
      const revRes = [...res].reverse();
      res.forEach((row) => {
        const tr = document.createElement("tr");
        tr.setAttribute("id", row[0]);
        tr.dataset.id = row[0];
        tr.classList.add("table-data");
        tr.innerHTML = `
<td class="item">${row[1]}</td>
<td class="type">${row[2]}</td>
<td class="date">${row[3]}</td>
<td class="status">${row[4]}</td>
<td><button type="button" class="edit-button">edit</button></td>
`;
        tr.dataset.id = row[0];
        document.getElementById("data").appendChild(tr);
      });
      let eventObjects = [];
      revRes.forEach((row) => {
        let [date, time] = row.date.split("T");
        date = date.split("-")[1] + "/" + date.split("-")[2];
        if (
          eventObjects[eventObjects.length - 1]?.date === date &&
          eventObjects[eventObjects.length - 1]?.time === time
        ) {
          eventObjects[eventObjects.length - 1].events.push({
            id: row.id,
            item: row.item,
            type: row.type,
            status: row.status,
          });
        } else {
          eventObjects.push({
            date: date,
            time: time,
            events: [
              {
                id: row.id,
                item: row.item,
                type: row.type,
                date: row.date,
                status: row.status,
              },
            ],
          });
        }
      });
      grid.innerHTML = "";
      eventObjects.forEach((event) => {
        const evenOdd =
          Number(event.date.split("/")[1]) % 2 === 0 ? "even" : "odd";
        const col = document.createElement("div");
        col.innerHTML = `
<div>
  <div class="grid-header">
    <div class="grid-date row ${evenOdd}">${event.date}</div>
    <div class="grid-time row ${evenOdd}">${event.time}</div>
  </div>
  ${items.map((item) => createCell(item, event)).join("")}
</div>
`;
        grid.appendChild(col);
      });
      grid.scrollLeft = grid.scrollWidth;
      document.querySelectorAll(".edit-button").forEach((button) => {
        button.addEventListener("click", toggleEditable);
      });

      document.querySelectorAll(".event-marker").forEach((el) => {
        el.addEventListener("click", (e) => loadModal(e));
      });
      document
        .querySelector(".editevent-form")
        .addEventListener("submit", editEvent);
    });
}

async function addEvent(e) {
  e.preventDefault();
  const formData = new FormData(e.target);

  let id;
  const item = formData.get("item");
  const event = formData.get("event");
  const date = formData.get("date");
  const time = formData.get("time");
  const status = formData.get("status");

  const formattedDate = date + "T" + time.padStart(2, "0") + ":00:00";

  try {
    client
      .execute("select id from events order by id desc limit 1")
      .then((res) => {
        console.log(res);
        id = res.rows.length === 0 ? 0 : res.rows[0].id + 1;
        try {
          client
            .execute({
              sql: "insert into events values (:id, :item, :event, :date, :status)",
              args: {
                id: Number(id),
                item: item,
                event: event,
                date: formattedDate,
                status: status,
              },
            })
            .then((res) => console.log(res));
          document.getElementById("data").innerHTML = "";
          getData();
        } catch (err) {
          console.log(err);
        }
      });
  } catch (err) {
    console.log(err);
  }
}

function editEvent(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const id = formData.get("id");
  const item = formData.get("item");
  const type = formData.get("type");
  const date = formData.get("date");
  const status = formData.get("status");

  try {
    client
      .execute({
        sql: "update events set item = :item, type = :type, date = :date, status = :status where id = :id",
        args: {
          id: Number(id),
          item: item,
          type: type,
          date: date,
          status: status,
        },
      })
      .then((res) => {
        console.log(res);
        document.getElementById("data").innerHTML = "";
        getData();
        document.querySelectorAll(".modal").forEach((el) => {
          el.style.visibility = "hidden";
        });
      });
  } catch (err) {
    console.log(err);
  }
}

document.querySelector("#app").innerHTML = `
<div class="flex">

  <div id="vert-header">
    <div class="vheader">Date:</div>
    <div class="vheader">Time:</div>
    ${items.map((item) => `<div class="vheader">${item}</div>`).join("")}
  </div>
  <div id="grid"></div>
</div>
<form name="newevent" id="newevent">
  <label>Item:<select name="item">
    ${items.map((item) => `<option value="${item}">${item}</option>`).join("")}
  </select></label>
  <label>Event:<select name="event">
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
getData();

window.addEventListener("load", getData);

document.getElementById("today").valueAsDate = new Date();
document.getElementById("newevent").addEventListener("submit", addEvent);
const modalBack = document.querySelector(".modal-backdrop");
modalBack.addEventListener("click", (event) => {
  if (modalBack !== event.target) return;
  document.querySelectorAll(".modal").forEach((el) => {
    el.style.visibility = "hidden";
  });
});
