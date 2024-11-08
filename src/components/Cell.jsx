import { useState } from "react";
import { useMemo } from "react";
import Edit from "./Edit.jsx";
import { v4 as uuid } from "uuid";

export default function Cell({ data, day, item, setData }) {
  const [edit, setEdit] = useState(false);
  const [currentItem, setCurrentItem] = useState({});
  const items = useMemo(() => {
    const d = day.fullDate.split(".")[0].split("T")[0];
    const arr = data.filter((i) => {
      return i.date.split("T")[0] == d && i.item == item;
    });
    return arr;
  }, [data, day]);

  function openModal(i) {
    setEdit(true);
    setCurrentItem(i);
  }

  return (
    <>
      <div
        className={"relative flex justify-center w-14 border border-1 border-slate-900"}
      >
        {items.map((i) => {
          const hour = Number(i.date.split("T")[1].split(":")[0]);
          return (
            <button
              className={"absolute w-full h-[10px] text-[8px] cursor-pointer flex justify-center timeline-" +
                hour +
                " " +
                i.type}
              key={i.id + i.type + i.item + uuid()}
              onClick={() => openModal(i)}
            >
              {i.type}
            </button>
          );
        })}
        {edit && (
          <Edit
            event={currentItem}
            setEdit={setEdit}
            data={data}
            setData={setData}
            key={uuid().toString()}
          />
        )}
      </div>
    </>
  );
}
