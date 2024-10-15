import { useState } from "react";
import Form from "./components/Form.jsx";
import Grid from "./components/Grid.jsx";

function App() {
  const [formData, setFormData] = useState({
    item: "4000",
    event: "CIP",
    date: new Date().toISOString().split("T")[0],
    time: "00",
    status: "completed",
  });
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  return (
    <>
      <div className="flex h-[100dvh] bg-slate-500 place-items-center">
        <div className="flex py-4 h-[100%] bg-blue-500 flex-col flex-grow place-items-center">
          <input
            type="date"
            name="selected-date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <Form
            data={formData}
            setData={setFormData}
          />
        </div>
        <div className="h-[100%] bg-yellow-500 flex-grow">
          <Grid
            date={selectedDate}
          />
        </div>
        <div className="h-[100%] bg-pink-500 flex-grow"></div>
      </div>
    </>
  );
}

export default App;
