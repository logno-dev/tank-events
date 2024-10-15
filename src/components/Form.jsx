import { items } from "../utils/constants.js";

export default function Form({ data, setData }) {
  return (
    <form
      className="flex flex-col flex-grow justify-center gap-2 font-bold"
      onSubmit={(e) => {
        e.preventDefault();
        console.log(data);
      }}
    >
      <label>
        Event:<select
          name="type"
          value={data.event}
          onChange={(e) => setData({ ...data, event: e.target.value })}
        >
          <option value="CIP">CIP</option>
          <option value="SB">SB</option>
          <option value="VEGE">VEGE</option>
          <option value="ESL">ESL</option>
        </select>
      </label>
      <label>
        Date:<input
          type="date"
          name="date"
          value={data.date}
          onChange={(e) => setData({ ...data, date: e.target.value })}
        />
      </label>
      <label>
        Status:<select
          name="status"
          value={data.status}
          onChange={(e) => setData({ ...data, status: e.target.value })}
        >
          <option value="completed">Completed</option>
          <option value="scheduled">Scheduled</option>
        </select>
      </label>
      <label>
        Item:<select
          value={data.item}
          onChange={(e) => setData({ ...data, item: e.target.value })}
        >
          {items.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
      <label>
        Hour:<input
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
        />
      </label>
      <button type="submit">Add</button>
    </form>
  );
}
