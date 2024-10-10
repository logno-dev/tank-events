import { createCell } from "./createCell.js";
import { loadModal } from "./loadModal.js";
import { items } from "./constants.js";
import { getDateRange } from "./getDateRange.js";

export function drawGrid(res, width) {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  const selectDate = new Date(document.getElementById("dateselect").value);
  const [startDate, endDate, days] = getDateRange(selectDate, width);

  for (let i = 1; i < days; i++) {
    let dayOfWeek = new Date(
      new Date().setDate(new Date(startDate).getDate() + i),
    );
    let monthDay = String(dayOfWeek.getMonth() + 1).padStart(2, "0") +
      "/" +
      String(dayOfWeek.getDate()).padStart(2, "0");
    grid.innerHTML += `
<div class="daycol">
  <div class="dayheader row">${monthDay}</div>
    <div class="hourwrapper">
      <div class="hourcol">
          ${
      items
        .map((item) => {
          return createCell(item, res, monthDay, 0, 25);
        })
        .join("")
    }
      </div>
    </div>
  </div>
</div>
`;
  }

  document.querySelectorAll(".event-marker").forEach((el) => {
    el.addEventListener("click", (e) => loadModal(e));
  });
}
