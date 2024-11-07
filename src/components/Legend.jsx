export default function Legend() {
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 flex place-items-center place-content-center p-2">
        <div className="flex gap-2 rounded-lg bg-slate-100 border-2 border-slate-700 p-1 font-bold">
          <h3 className="p-1">Legend:</h3>
          <Label item="CIP" />
          <Label item="SB" />
          <Label item="VEGE" />
          <Label item="ESL" />
          <Label item="MAINT" />
          <Label item="DUMP" />
        </div>
      </div>
    </>
  );
}

function Label({ item }) {
  return (
    <div className={"rounded-lg text-center w-16 p-1 " + item}>{item}</div>
  );
}
