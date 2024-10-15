import { client } from "./client.js";

// query to pull latest status:
// select *, max(date) as last_date from events where status = "completed" group by item;

export function isExpired(item) {
  client
    .execute({
      sql:
        "select * from events where item = :item and status = :status order by date desc limit 1",
      args: { item: item, status: "completed" },
    })
    .then((res) => {
      const data = res.rows[0];
      const timeSinceCIP = (new Date() - new Date(data.date)) / 1000 / 60 / 60;
      return (data.type === "CIP" && timeSinceCIP > 72);
    });
}
