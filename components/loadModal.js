export function loadModal(e) {
  const id = e.target.dataset.id;
  const item = e.target.dataset.item;
  const type = e.target.dataset.type;
  const date = e.target.dataset.date;
  const status = e.target.dataset.status;

  const modalForm = document.getElementById("modal-form");
  modalForm.querySelector(".modal-id").value = id;
  modalForm.querySelector(".modal-item").value = item;
  modalForm.querySelector(".modal-type").value = type;
  modalForm.querySelector(".modal-date").value = date;
  modalForm.querySelector(".modal-status").value = status;
  //
  document.querySelectorAll(".modal").forEach((el) => {
    el.style.visibility = "visible";
  });
}
