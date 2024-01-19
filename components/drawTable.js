import { toggleEditable } from "./toggleEditable.js";

export function drawTable(res) {
  res.forEach((row) => {
    const tr = document.createElement("tr");
    tr.setAttribute("id", row[0]);
    tr.dataset.id = row[0];
    tr.classList.add("table-data");
    tr.innerHTML = `
      <td class="item">${row[1]}</td >
<td class="type">${row[2]}</td>
<td class="date">${row[3]}</td>
<td class="status">${row[4]}</td>
<td><button type="button" class="edit-button">edit</button></td>
    `;
    tr.dataset.id = row[0];
    document.getElementById("data").appendChild(tr);
  });

  document.querySelectorAll(".edit-button").forEach((button) => {
    button.addEventListener("click", toggleEditable);
  });
}
