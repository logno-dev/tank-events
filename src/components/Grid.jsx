import { useState } from "react";
import { getDateRange } from "../utils/getDateRange.js";
import { items } from "../utils/constants.js";
import { useEffect } from "react";
import { useMemo } from "react";
import Cell from "./Cell.jsx";
import { v4 as uuid } from "uuid";

export default function Grid({ date, data, setData }) {
  const [days, setDays] = useState();
  const [startDate, setStartDate] = useState();

  useEffect(() => {
    const [sd, _, d] = getDateRange(date, 3);
    setStartDate(sd);
    setDays(d);
  }, [date]);

  const d = useMemo(() => {
    return data;
  }, [data]);

  const daysArr = useMemo(() => {
    const tempDaysArr = [];
    for (let i = 1; i < days; i++) {
      const dayOfWeek = new Date(
        new Date(startDate).setDate(new Date(startDate).getDate() + i),
      );
      const monthDay =
        String(dayOfWeek.getMonth() + 1).padStart(2, "0") +
        "/" +
        String(dayOfWeek.getDate()).padStart(2, "0");
      tempDaysArr.push({ monthDay, fullDate: dayOfWeek.toISOString() });
    }
    console.log(tempDaysArr);
    return tempDaysArr;
  }, [days, startDate]);

  return (
    <>
      <div className="flex">
        <div>
          <div className="sticky top-0 border border-black bg-slate-100 w-16 h-6 z-30"></div>
          {daysArr.map((day) => (
            <div
              key={day.monthDay.toString() + uuid().toString()}
              className="border border-black w-16 h-[250px] flex place-content-center items-center"
            >
              {day.monthDay}
            </div>
          ))}
        </div>
        {items.map((item) => (
          <div key={item.toString() + uuid().toString()}>
            <div
              className="flex sticky top-0 place-content-center items-center text-xs border border-black bg-slate-100 w-14 h-6 z-30"
              key={uuid().toString()}
            >
              {item}
            </div>
            {daysArr.map((day) => (
              <div
                className="border border-black w-14 h-[250px]"
                key={item.toString() + day.monthDay + uuid().toString()}
              >
                {d && <Cell data={d} day={day} item={item} setData={setData} />}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
