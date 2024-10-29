import { client } from "./client.js";

export function addEvent(e) {
  let id;
  client
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
}
