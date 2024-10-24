import { useMemo } from "react";
import { v4 as uuid } from "uuid";

export default function Cell({ data, day, item }) {
  const items = useMemo(() => {
    const d = day.fullDate.toISOString().split(".")[0].split("T")[0];
    const arr = data.filter((i) => {
      return i.date.split("T")[0] == d && i.item == item;
    });
    return arr;
  }, [data, day]);
  return (
    <>
      <div className="relative flex justify-center">
        {items.map((i) => {
          const hour = Number(i.date.split("T")[1].split(":")[0]);
          console.log(hour);
          return (
            <div
              className={
                "absolute w-full h-[10px] text-[8px] flex justify-center timeline-" +
                hour +
                " " +
                i.type
              }
              key={i.id + i.type + i.item + uuid()}
            >
              {i.type}
            </div>
          );
        })}
      </div>
    </>
  );
}
