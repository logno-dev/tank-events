import "./style.css";
import { client } from "./components/client.js";

async function getData() {
  const data = await client.execute("select * from events").then((response) => {
    const res = response.rows;
    res.forEach((row) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
<td>${row[0]}</td>
<td>${row[1]}</td>
<td>${row[2]}</td>
<td>${row[3]}</td>
<td>${row[4]}</td>
`;
      document.getElementById("data").appendChild(tr);
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
      <option value="scheduled">Scheduled</option>
      <option value="completed">Completed</option>
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
