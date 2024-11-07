import { useState } from "react";
import { addEvent } from "./utils/actions";

export default function Dump() {
  const [added, setAdded] = useState(false);

  function add(e) {
    e.preventDefault();
    const item = {
      item: "skid",
      type: "DUMP",
      date: new Date().toISOString(),
      time: String(new Date().getHours()).padStart(2, "0"),
      status: "completed",
    };
    addEvent(item);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 3000);
  }

  return (
    <div className="flex flex-col gap-4 fixed top-0 bottom-0 left-0 right-0 bg-orange-500 text-slate-100 text-xl place-items-center place-content-center">
      <h2>Caustic Tank Dump</h2>
      <form
        onSubmit={(e) => {
          add(e);
        }}
      >
        <button
          type="submit"
          className="bg-orange-500 text-slate-100 rounded-xl border border-8 border-slate-100 text-3xl p-14 hover:bg-slate-100 hover:text-orange-500"
        >
          DUMP!
        </button>
      </form>
      {added ? (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex place-items-center place-content-center">
          <div className="text-2xl text-orange-500 rounded-lg p-14 bg-slate-100 fade">
            Dump added successfully
          </div>
        </div>
      ) : null}
    </div>
  );
}
