import { client } from "./client.js";
import { getDateRange } from "./getDateRange.js";

export async function getData(date, width) {
  const [startDate, endDate] = getDateRange(date, width);

  const data = await client
    .execute({
      sql:
        "select * from events where date >= :startDate and date < :endDate order by date desc",
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
