import "./style.css";
import { client } from "./components/client.js";

async function getData() {
  const data = await client
    .execute("select * from events order by date")
    .then((response) => {
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
      document.getElementById("grid").innerHTML = "";
      res.forEach((row) => {
        let [date, time] = row.date.split("T");
        date = date.split("-")[1] + "/" + date.split("-")[2];
        const col = document.createElement("div");
        col.innerHTML = `
<div>
  <div class="grid-header">
    <div class="row">${date}</div>
    <div class="row">${time}</div>
  </div>
  <div class="row">${row.item === "chiller" ? row.type : ""}</div>
  <div class="row">${row.item === "2100" ? row.type : ""}</div>
  <div class="row">${row.item === "3200" ? row.type : ""}</div>
  <div class="row">${row.item === "2300" ? row.type : ""}</div>
  <div class="row">${row.item === "3300" ? row.type : ""}</div>
  <div class="row">${row.item === "2200" ? row.type : ""}</div>
  <div class="row">${row.item === "3100" ? row.type : ""}</div>
  <div class="row">${row.item === "2000" ? row.type : ""}</div>
  <div class="row">${row.item === "3000" ? row.type : ""}</div>
  <div class="row">${row.item === "4000" ? row.type : ""}</div>
  <div class="row">${row.item === "filler2" ? row.type : ""}</div>
  <div class="row">${row.item === "filler3" ? row.type : ""}</div>
  <div class="row">${row.item === "filler4" ? row.type : ""}</div>
  <div class="row">${row.item === "filler5" ? row.type : ""}</div>
  <div class="row">${row.item === "fruitlines" ? row.type : ""}</div>
  <div class="row">${row.item === "hoses" ? row.type : ""}</div>
</div>
`;
        document.getElementById("grid").appendChild(col);
      });
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
    <div class="vheader">Chiller</div>
    <div class="vheader">2100</div>
    <div class="vheader">3200</div>
    <div class="vheader">2300</div>
    <div class="vheader">3300</div>
    <div class="vheader">2200</div>
    <div class="vheader">3100</div>
    <div class="vheader">2000</div>
    <div class="vheader">3000</div>
    <div class="vheader">4000</div>
    <div class="vheader">Filler 2</div>
    <div class="vheader">Filler 3</div>
    <div class="vheader">Filler 4</div>
    <div class="vheader">Filler 5</div>
    <div class="vheader">Fruit Lines</div>
    <div class="vheader">Hoses</div>
  </div>
  <div id="grid"></div>
</div>
<form name="newevent" id="newevent">
  <label>Item:<select name="item">
    <option value="chiller">Chiller</option>
    <option value="2100">2100</option>
    <option value="3200">3200</option>
    <option value="2300">2300</option>
    <option value="3300">3300</option>
    <option value="2200">2200</option>
    <option value="3100">3100</option>
    <option value="2000">2000</option>
    <option value="3000">3000</option>
    <option value="4000">4000</option>
    <option value="filler2">Filler 2</option>
    <option value="filler3">Filler 3</option>
    <option value="filler4">Filler 4</option>
    <option value="filler5">Filler 5</option>
    <option value="fruitlines">Fruit Lines</option>
    <option value="hoses">Hoses</option>
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
