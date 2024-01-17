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

function createCell(iterator, event, date, time1, time2) {
  const formatDate = date.replace("/", "-");
  const objectArr = event.filter((e) => e.date.includes(formatDate));
  const objectIndex = objectArr.findIndex((e) => e.item.includes(iterator));
  const evenOdd = Number(date.split("/")[1]) % 2 === 0 ? "even" : "odd";
  const e = objectArr[objectIndex];
  if (!e) {
    return `<div class="row ${evenOdd} event-marker"
  data-id=""
  data-item="${iterator}"
  data-date="${new Date().getFullYear() + "-" + formatDate + "T" + time1 + ":00:00:00Z"
      }"
></div>`;
  }
  const hour = e.date.split("T")[1].split(":")[0];
  if (
    objectIndex !== -1 &&
    e.item === iterator &&
    hour >= time1 &&
    hour < time2
  ) {
    return `<div class="row event-marker ${e.status} ${e.type} ${evenOdd}"
  data-id="${e.id}"
  data-item="${e.item}"
  data-type="${e.type}"
  data-date="${e.date}"
  data-status="${e.status}"
  >${e.type}</div>`;
  } else {
    return `<div class="row ${evenOdd} event-marker"
  data-id="${e.id}"
  data-item="${e.item}"
  data-type="${e.type}"
  data-date="${e.date}"
  data-status="${e.status}"
></div>`;
  }
}

async function getData() {
  const data = await client
    .execute("select * from events order by date desc limit 100")
    .then((response) => {
      const grid = document.getElementById("grid");
      const res = response.rows;
      console.log(res);
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
      //       eventObjects.forEach((event) => {
      //         const evenOdd =
      //           Number(event.date.split("/")[1]) % 2 === 0 ? "even" : "odd";
      //         const col = document.createElement("div");
      //         col.innerHTML = `
      // <div>
      //   <div class="grid-header">
      //     <div class="grid-date row ${evenOdd}">${event.date}</div>
      //     <div class="grid-time row ${evenOdd}">${event.time}</div>
      //   </div>
      //   ${items.map((item) => createCell(item, event)).join("")}
      // </div>
      // `;
      //         grid.appendChild(col);
      //       });
      const paramDate = new URL(window.location).searchParams.get("date");
      if (paramDate) {
        document.getElementById("dateselect").valueAsDate = new Date(paramDate);
      } else {
        document.getElementById("dateselect").valueAsDate = new Date();
      }
      const selectDate = new Date(document.getElementById("dateselect").value);
      const sunday = new Date(
        selectDate.setDate(new Date().getDate() - new Date().getDay()),
      );
      for (let i = 0; i < 8; i++) {
        let dayOfWeek = new Date(new Date().setDate(sunday.getDate() + i));
        let monthDay =
          String(dayOfWeek.getMonth() + 1).padStart(2, "0") +
          "/" +
          String(dayOfWeek.getDate()).padStart(2, "0");
        grid.innerHTML += `
<div class="daycol">
  <div class="dayheader row">${monthDay}</div>
    <div class="hourwrapper">
      <div class="hourcol">
        <div class="hourheader row">0-6</div>
          ${items
            .map((item) => {
              return createCell(item, res, monthDay, 0, 7);
            })
            .join("")}
      </div>
      <div class="hourcol">
        <div class="hourheader row">7-12</div>
          ${items
            .map((item) => {
              return createCell(item, res, monthDay, 7, 13);
            })
            .join("")}
      </div>
      <div class="hourcol">
        <div class="hourheader row">13-18</div>
          ${items
            .map((item) => {
              return createCell(item, res, monthDay, 13, 19);
            })
            .join("")}
      </div>
      <div class="hourcol">
        <div class="hourheader row">19-24</div>
          ${items
            .map((item) => {
              return createCell(item, res, monthDay, 19, 25);
            })
            .join("")}
      </div>
    </div>
  </div>
</div>
`;
        // grid.innerHTML += dayOfWeek.toLocaleString();
      }
      grid.scrollLeft = grid.scrollWidth;
      document.querySelectorAll(".edit-button").forEach((button) => {
        button.addEventListener("click", toggleEditable);
      });

      document.querySelectorAll(".event-marker").forEach((el) => {
        el.addEventListener("click", (e) => loadModal(e));
      });
      document
        .querySelector(".editevent-form")
        .addEventListener("submit", (e) => {
          if (!new FormData(e.target).get("id")) {
            addEvent(e);
          } else {
            editEvent(e);
          }
        });
    });
}

async function addEvent(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  let id;
  const item = formData.get("item");
  const event = formData.get("type");
  const date = formData.get("date");
  const time = formData.get("time") || "";
  const status = formData.get("status");

  const formattedDate = date.includes("T")
    ? date
    : date + "T" + time.padStart(2, "0") + ":00:00";

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
  <label>Select Date:
    <input type="date" id="dateselect">
  </label>
</div>
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

document.getElementById("dateselect").addEventListener("change", (e) => {
  window.location.href = window.location.origin + "?date=" + e.target.value;
});
