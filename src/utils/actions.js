import { client } from "./client.js";

export async function addEvent(e) {
  let id;
  const response = await client
    .execute("select id from events order by id desc limit 1")
    .then((res) => {
      id = res.rows.length === 0 ? 0 : res.rows[0].id + 1;
      client
        .execute({
          sql: "insert into events values (:id, :item, :event, :date, :status)",
          args: {
            id: Number(id),
            item: e.item,
            event: e.type,
            date: e.date,
            status: e.status,
          },
        })
        .then((r) => console.log(r));
      return id;
    });
  return response;
}

export function editEvent(e) {
  console.log(e);
  client
    .execute({
      sql:
        "update events set item = :item, type = :event, date = :date, status = :status where id = :id",
      args: {
        id: Number(e.id),
        item: e.item,
        event: e.type,
        date: e.date,
        status: e.status,
      },
    })
    .then((r) => console.log(r));
}

export function deleteEvent(e) {
  console.log(e);
  client
    .execute({
      sql: "delete from events where id = :id",
      args: {
        id: Number(e),
      },
    })
    .then((r) => console.log(r));
}
