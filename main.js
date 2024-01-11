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

function createCell(iterator, event) {
  let eventItems = [];
  event.events.forEach((e) => eventItems.push(e.item));
  if (eventItems.includes(iterator)) {
    return `<div class="row ${event.events.find((e) => e.item === iterator).status
      } ${event.events.find((e) => e.item === iterator).type}">${event.events.find((e) => e.item === iterator).type
      }</div>`;
  } else {
    return `<div class="row"></div>`;
  }
}

async function getData() {
  const data = await client
    .execute("select * from events order by date")
    .then((response) => {
      const grid = document.getElementById("grid");
      const res = response.rows;
      res.forEach((row) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
<td>${row[1]}</td>
<td>${row[2]}</td>
<td>${row[3]}</td>
<td>${row[4]}</td>
`;
        tr.dataset.id = row[0];
        document.getElementById("data").appendChild(tr);
      });
      let eventObjects = [];
      res.forEach((row) => {
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
                status: row.status,
              },
            ],
          });
        }
      });
      grid.innerHTML = "";
      eventObjects.forEach((event) => {
        const col = document.createElement("div");
        col.innerHTML = `
<div>
  <div class="grid-header">
    <div class="grid-date row">${event.date}</div>
    <div class="grid-time row">${event.time}</div>
  </div>
  ${items.map((item) => createCell(item, event)).join("")}
</div>
`;
        grid.appendChild(col);
      });
      grid.scrollLeft = grid.scrollWidth;
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

  const formattedDate = date + "T" + time;

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
    <input type="time" name="time" value="12:00:00">
</label>
  <label>Status:
    <select name="status">
      <option value="completed">Completed</option>
      <option value="scheduled">Scheduled</option>
    </select>
  </label>
  <button type="submit">Add Event</button>
</form>
  <table id="data">
  </table>
`;
getData();

document.getElementById("today").valueAsDate = new Date();
document.getElementById("newevent").addEventListener("submit", addEvent);
