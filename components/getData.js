import { client } from "./client.js";
import { getDateRange } from "./getDateRange.js";

export async function getData(width) {
  const paramDate = new URL(window.location).searchParams.get("date");
  if (paramDate) {
    document.getElementById("dateselect").valueAsDate = new Date(paramDate);
  } else {
    document.getElementById("dateselect").valueAsDate = new Date();
  }

  const selectDate = new Date(document.getElementById("dateselect").value);

  const [startDate, endDate] = getDateRange(selectDate, 2);

  const data = client
    .execute({
      sql: "select * from events where date > :startDate and date < :endDate order by date desc",
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
