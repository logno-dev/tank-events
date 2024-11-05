import { json2csv } from "json-2-csv";
import { useState } from "react";
import { exportData } from "../utils/getData.js";

export default function Download() {
  const [url, setUrl] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  async function getCsv(e) {
    e.preventDefault();
    await exportData(
      new Date(startDate).toISOString() || "2020-01-01",
      new Date(endDate).toISOString() || new Date().toISOString(),
    )
      .then((data) => {
        const csv = json2csv(data);
        const blob = new Blob([csv], { type: "text/csv" });
        setUrl(URL.createObjectURL(blob));
      });
  }

  return (
    <>
      <form className="flex flex-col gap-2" onSubmit={(e) => getCsv(e)}>
        <label className="text-white font-bold">
          Start: &nbsp;
          <input
            className="text-slate-900 p-1 rounded-md text-center"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </label>
        <label className="text-white font-bold">
          End: &nbsp;
          <input
            type="date"
            className="text-slate-900 p-1 rounded-md text-center"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </label>
        <button
          className="p-1 text-white border-2 rounded-md border-white hover:bg-white hover:text-slate-600"
          type="submit"
        >
          Generate CSV
        </button>
        {url
          ? (
            <a
              className="text-center p-1 text-white border-2 rounded-md border-white hover:bg-white hover:text-slate-600"
              href={url}
              download="cips.csv"
            >
              Download CSV
            </a>
          )
          : null}
      </form>
    </>
  );
}
