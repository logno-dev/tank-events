import { items } from "../utils/constants.js";

export default function Form({ data, setData }) {
  return (
    <form
      className="flex flex-col flex-grow justify-center gap-2 font-bold text-white"
      onSubmit={(e) => {
        e.preventDefault();
        console.log(data);
      }}
    >
      <label>
        Event:{" "}
        <select
          name="type"
          value={data.event}
          onChange={(e) => setData({ ...data, event: e.target.value })}
          className="text-black p-1 rounded-md"
        >
          <option value="CIP">CIP</option>
          <option value="SB">SB</option>
          <option value="VEGE">VEGE</option>
          <option value="ESL">ESL</option>
        </select>
      </label>
      <label>
        Date:{" "}
        <input
          type="date"
          name="date"
          value={data.date}
          onChange={(e) => setData({ ...data, date: e.target.value })}
          className="text-black p-1 rounded-md"
        />
      </label>
      <label>
        Status:{" "}
        <select
          name="status"
          value={data.status}
          onChange={(e) => setData({ ...data, status: e.target.value })}
          className="text-black p-1 rounded-md"
        >
          <option value="completed">Completed</option>
          <option value="scheduled">Scheduled</option>
        </select>
      </label>
      <label>
        Item:{" "}
        <select
          value={data.item}
          onChange={(e) => setData({ ...data, item: e.target.value })}
          className="text-black p-1 rounded-md"
        >
          {items.map((item) => <option key={item} value={item}>{item}</option>)}
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
          onChange={(e) =>
            setData({
              ...data,
              time: e.target.value.slice(0, 2),
            })}
          value={data.time}
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
