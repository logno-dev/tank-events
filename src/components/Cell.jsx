import { useMemo } from "react";

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
      <div>
        {items.map((i) => <div key={i.id + i.type + i.item}>{i.type}</div>)}
      </div>
    </>
  );
}
