import { client } from "./client.js";
import { getData } from "./getData.js";

export async function addEvent(e) {
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
            });
          document.getElementById("data").innerHTML = "";
          getData(3);
          document.querySelectorAll(".modal").forEach((el) => {
            el.style.visibility = "hidden";
          });
        } catch (err) {
          console.log(err);
        }
      });
  } catch (err) {
    console.log(err);
  }
}

export function editEvent(e) {
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
