import { useState } from "react";
import { getDateRange } from "../utils/getDateRange.js";
import { items } from "../utils/constants.js";
import { useEffect } from "react";
import { useMemo } from "react";

export default function Grid({ date }) {
  const [days, setDays] = useState();
  const [startDate, setStartDate] = useState();

  useEffect(() => {
    console.log("date changed to:", date);
    const [sd, d] = getDateRange(date, 2);
    setStartDate(sd);
    setDays(d);
  }, [date]);

  const daysArr = useMemo(() => {
    const tempDaysArr = [];
    for (let i = 1; i < days; i++) {
      const dayOfWeek = new Date(
        new Date().setDate(new Date(startDate).getDate() + i),
      );
      const monthDay = String(dayOfWeek.getMonth() + 1).padStart(2, "0") + "/" +
        String(dayOfWeek.getDate()).padStart(2, "0");
      tempDaysArr.push(monthDay);
    }
    return tempDaysArr;
  }, [days, startDate]);

  useEffect(() => {
    console.log(daysArr);
  }, [daysArr]);

  return (
    <>
      <div>
        {items.map((item) => (
          <span className="p-1 border border-black" key={item}>{item}</span>
        ))}
      </div>
      {daysArr.map((day) => <div key={day}>{day}</div>)}
    </>
  );
}
