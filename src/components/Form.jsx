import { useState } from "react";
import { items } from "../utils/constants.js";
import { addEvent } from "../utils/actions.js";

export default function Form({ data, setData }) {
  const [item, setItem] = useState("4000");
  const [type, setType] = useState("CIP");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("00");
  const [status, setStatus] = useState("completed");

  const formData = {
    item,
    type,
    date: date + "T" + time.padStart(2, "0") + ":00:00",
    time,
    status,
  };

  async function add(e) {
    const id = await addEvent(e);
    console.log(id);
    setData([...data, { id, ...e }]);
  }

  return (
    <form
      className="flex flex-col flex-grow justify-center gap-2 font-bold text-white"
      onSubmit={(e) => {
        e.preventDefault();
        add(formData);
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
          <option value="MAINT">MAINT</option>
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
        className="p-1 w-14 border-2 rounded-md border-white hover:bg-white hover:text-slate-600"
        type="submit"
      >
        Add
      </button>
    </form>
  );
}
