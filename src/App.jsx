import { useEffect, useState } from "react";
import Form from "./components/Form.jsx";
import Grid from "./components/Grid.jsx";
import { getData } from "./utils/getData.js";

function App() {
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  async function response() {
    await getData(selectedDate, 2).then((r) => setData(r));
  }

  useEffect(() => {
    response();
  }, [selectedDate]);

  return (
    <>
      <div className="flex min-h-[100dvh] place-items-center items-start">
        <div className="flex px-2 py-4 min-h-[100dvh] bg-slate-500 flex-col flex-grow place-items-center">
          <input
            type="date"
            name="selected-date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <Form data={data} setData={setData} />
        </div>
        <div className="h-[100dvh] flex-grow overflow-auto">
          {data && <Grid date={selectedDate} data={data} />}
        </div>
        <div className="h-[100%] flex-grow"></div>
      </div>
    </>
  );
}

export default App;
