import { items } from "./constants.js";

export function toggleEditable(e) {
  const row = e.target.parentNode.parentNode;
  const id = row.dataset.id;
  const item = row.querySelector(".item").innerText;
  const type = row.querySelector(".type").innerText;
  const date = row.querySelector(".date").innerText;
  const status = row.querySelector(".status").innerText;

  row.innerHTML = `
<td colspan="5">
  <form name="editevent" class="editevent-form">
  <input type="hidden" name="id" value="${id}">
  <select name="item" class="item"">
    ${items
      .map(
        (i) =>
          `<option value="${i}" ${item === i ? "selected" : ""}>${i}</option>`,
      )
      .join("")}
    </select>
  <select name="type" class="type">
    <option value="CIP" ${type === "CIP" ? "selected" : ""}>CIP</option>
    <option value="SB" ${type === "SB" ? "selected" : ""}>SB Bio</option>
    <option value="VEGE" ${type === "VEGE" ? "selected" : ""}>VEGE</option>
    <option value="ESL" ${type === "ESL" ? "selected" : ""}>ESL</option>
  </select>
  <input type="text" name="date" value="${date}">
  <select name="status" class="status" value="${status}">
    <option value="completed" ${status === "completed" ? "selected" : ""
    }>Completed</option>
    <option value="scheduled" ${status === "scheduled" ? "selected" : ""
    }>Scheduled</option>
  </select>
  <button type="submit">Save</button>
    </form>
</td>
`;
}
