import { useState } from "react";
import { useMemo } from "react";
import { v4 as uuid } from "uuid";

export default function Cell({ data, day, item }) {
  const [edit, setEdit] = useState(false);
  const items = useMemo(() => {
    const d = day.fullDate.toISOString().split(".")[0].split("T")[0];
    const arr = data.filter((i) => {
      return i.date.split("T")[0] == d && i.item == item;
    });
    return arr;
  }, [data, day]);

  return (
    <>
      <div key={uuid()} className="relative flex justify-center">
        {items.map((i) => {
          const hour = Number(i.date.split("T")[1].split(":")[0]);
          return (
            <button
              className={
                "absolute w-full h-[10px] text-[8px] cursor-pointer flex justify-center timeline-" +
                hour +
                " " +
                i.type
              }
              key={i.id + i.type + i.item + uuid()}
              onClick={() => setEdit(true)}
            >
              {i.type}
            </button>
          );
        })}
        {edit && <Edit setEdit={setEdit} />}
      </div>
    </>
  );
}

function Edit(i, setEdit) {
  return (
    <>
      <button
        onClick={() => setEdit(false)}
        className="fixed flex place-items-center place-content-center top-0 left-0 right-0 bottom-0 bg-[#77777755]"
      >
        <div className="p-3 bg-gray-500">TEST</div>
      </button>
    </>
  );
}
