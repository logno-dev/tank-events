import { client } from "./client.js";
import { items } from "./constants.js";
import { getDateRange } from "./getDateRange.js";

export async function getData(date, width) {
  const [startDate, endDate] = getDateRange(date, width);

  const data = await client
    .execute({
      sql: "select * from events where date >= :startDate and date < :endDate order by date desc",
      args: {
        startDate: startDate,
        endDate: endDate,
      },
    })
    .then((response) => {
      return response.rows;
    });
  return data;
}

export async function exportData(startDate, endDate) {
  const data = await client
    .execute({
      sql: "select * from events where date >= :startDate and date < :endDate order by date desc",
      args: {
        startDate: startDate,
        endDate: endDate,
      },
    })
    .then((response) => {
      return response.rows;
    });
  return data;
}

export async function getLastCip() {
  const data = await client
    .execute(
      "select item, max(date) as date from events where type = 'CIP' group by item",
    )
    .then((res) => {
      return res.rows;
    });
  return data;
}
