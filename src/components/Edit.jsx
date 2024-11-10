import { useState } from "react";
import { deleteEvent, editEvent } from "../utils/actions.js";
import { items } from "../utils/constants.js";

export default function Edit({ event, setEdit, data, setData }) {
  const [item, setItem] = useState(event.item);
  const [type, setType] = useState(event.type);
  const [date, setDate] = useState(
    event.date.split("T")[0],
  );
  const [time, setTime] = useState(event.date.split("T")[1].split(":")[0]);
  const [status, setStatus] = useState(event.status);

  const formData = {
    id: event.id,
    item,
    type,
    date: date + "T" + time.toString().padStart(2, "0") + ":00:00",
    time,
    status,
  };

  function edit() {
    editEvent(formData);
    setData([...data].map((d) => {
      if (d.id === formData.id) {
        return formData;
      }
      return d;
    }));
    setEdit(false);
  }

  function remove() {
    deleteEvent(formData.id);
    setData([...data].filter((d) => d.id !== formData.id));
    setEdit(false);
  }

  return (
    <>
      <div className="fixed flex place-items-center place-content-center z-50 top-0 left-0 right-0 bottom-0 bg-[#77777755]">
        <div
          onClick={() => setEdit(false)}
          className="fixed z-40 top-0 left-0 right-0 bottom-0 "
        >
        </div>
        <div className="p-8 rounded-lg bg-gray-500 z-50">
          <form
            className="flex flex-col flex-grow justify-center gap-2 font-bold text-white"
            onSubmit={(e) => {
              e.preventDefault();
              edit(formData);
            }}
          >
            <label>
              Event:{" "}
              <select
                name="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="text-black p-1 rounded-md"
              >
                <option value="CIP">CIP</option>
                <option value="SB">SB</option>
                <option value="VEGE">VEGE</option>
                <option value="ESL">ESL</option>
                <option value="DUMP">DUMP</option>
              </select>
            </label>
            <label>
              Date:{" "}
              <input
                type="date"
                name="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="text-black p-1 rounded-md"
              />
            </label>
            <label>
              Status:{" "}
              <select
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="text-black p-1 rounded-md"
              >
                <option value="completed">Completed</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </label>
            <label>
              Item:{" "}
              <select
                value={item}
                onChange={(e) => setItem(e.target.value)}
                className="text-black p-1 rounded-md"
              >
                {items.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Hour:{" "}
              <input
                type="number"
                min="0"
                max="24"
                name="time"
                id="time"
                onChange={(e) => setTime(e.target.value.slice(0, 2))}
                value={time}
                className="text-black p-1 rounded-md"
              />
            </label>
            <button
              className="p-1 w-18 border-2 rounded-md border-white hover:bg-white hover:text-slate-600"
              type="submit"
            >
              Edit
            </button>
            <button
              className="p-1 w-18 border-2 rounded-md border-white  bg-red-700 hover:bg-white hover:text-red-700"
              type="button"
              onClick={remove}
            >
              Delete
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
