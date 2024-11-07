import { useMemo, useEffect, useState } from "react";
// import { items } from "../utils/constants";
import { getLastCip } from "../utils/getData";

export default function Violations() {
  const [last, setLast] = useState([]);

  const violations = useMemo(() => {
    const vio = [];
    last.forEach((item) => {
      if ((new Date() - new Date(item.date)) / 1000 / 60 / 60 > 72) {
        vio.push({
          warning: item.item + " has not been CIP'd within the past 72 hours",
          id: item.id,
        });
      }
    });
    return vio;
  }, [last]);

  useEffect(() => {
    getLastCip().then((res) => setLast(res));
  }, []);

  return (
    <div className="h-[100dvh] overflow-auto">
      <ul className="flex flex-col gap-2 p-4">
        {violations.map((v) => (
          <li
            key={v.id}
            className="p-2 rounded-md bg-orange-500 text-slate-100"
          >
            <h5 className="font-bold text-lg">Warning!</h5>
            {v.warning}
          </li>
        ))}
      </ul>
    </div>
  );
}
