import { client } from "./client.js";
import { getDateRange } from "./getDateRange.js";

export function getData(date, width) {
  const paramDate = new URL(window.location).searchParams.get("date");
  if (paramDate) {
    document.getElementById("dateselect").valueAsDate = new Date(paramDate);
  } else {
    document.getElementById("dateselect").valueAsDate = new Date();
  }

  const [startDate, endDate] = getDateRange(date, width);

  const data = client
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
