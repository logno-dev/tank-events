export function createCell(iterator, event, date, time1, time2) {
  const formatDate = date.replace("/", "-");
  const objectArr = event.filter((e) => e.date.includes(formatDate));
  const reducedArr = objectArr.filter((e) => {
    let time = e.date.split("T")[1].split(":")[0];
    return e.item.includes(iterator) && time >= time1 && time < time2;
  });
  const evenOdd = Number(date.split("/")[1]) % 2 === 0 ? "even" : "odd";
  if (reducedArr.length === 0) {
    return `<div class="row ${evenOdd}">
<div class="dot add event-marker"
  data-id=""
  data-item="${iterator}"
  data-date="${new Date().getFullYear() + "-" + formatDate + "T" + time1 + ":00:00:00Z"
      }"
>+</div>

</div>`;
  }
  reducedArr.sort((a, b) => {
    let timea = a.date.split("T")[1].split(":")[0];
    let timeb = b.date.split("T")[1].split(":")[0];
    if (timea < timeb) {
      return -1;
    } else if (timea > timeb) {
      return 1;
    }
    return 0;
  });
  return `
<div class="row ${evenOdd}">
${reducedArr
      .map((e) => {
        return `
<div class="dot event-marker ${e.status} ${e.type}"
data-id="${e.id}"
data-item="${e.item}"
data-type="${e.type}"
data-date="${e.date}"
data-status="${e.status}"
>${e.type}</div>
`;
      })
      .join("")}
<div class="dot add event-marker"
data-id=""
data-item="${iterator}"
data-date="${new Date().getFullYear() + "-" + formatDate + "T" + time1 + ":00:00:00Z"
    }"
>+</div>
</div >
      `;
}
