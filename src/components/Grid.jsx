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
      const monthDay = String(dayOfWeek.getMonth() + 1).padStart(2, "0") +
        "/" +
        String(dayOfWeek.getDate()).padStart(2, "0");
      tempDaysArr.push({ monthDay, fullDate: dayOfWeek.toISOString() });
    }
    return tempDaysArr;
  }, [days, startDate]);

  return (
    <>
      <div className="flex flex-col max-h-[100dvh] overflow-auto">
        <div>
          <div className="flex bg-slate-100 sticky top-0 z-30">
            <div className=" border border-black w-16 h-6">
            </div>
            {items.map((item) => (
              <div
                className="flex place-content-center items-center text-xs border border-black bg-slate-100 w-14 h-6 z-30"
                key={uuid().toString()}
              >
                {item}
              </div>
            ))}
          </div>
          {daysArr.map((day) => {
            const date = day.fullDate.split(".")[0].split("T")[0];
            const arr = d.filter((i) => {
              return i.date.split("T")[0] == date;
            });
            return (
              <div
                key={uuid().toString()}
                className={"flex bg-slate-200 " +
                  (arr.length !== 0 ? "populated" : null)}
              >
                <div
                  key={day.monthDay.toString() + uuid().toString()}
                  className="border border-black w-16 flex place-content-center items-center"
                >
                  {day.monthDay}
                </div>
                {items.map(
                  (item) =>
                    d && (
                      <Cell
                        data={d}
                        day={day}
                        item={item}
                        setData={setData}
                        key={uuid().toString()}
                      />
                    ),
                )}
              </div>
            );
          })}
          <div className="h-12"></div>
        </div>
      </div>
    </>
  );
}
