export function getDateRange(date, buffer) {
  const selectDate = new Date(date);
  selectDate.setHours(0);
  const tzo = selectDate.getTimezoneOffset() / 60;
  const startDate = new Date(
    new Date(
      new Date(selectDate.toISOString()).setDate(
        selectDate.getDate() - (selectDate.getDay() + buffer),
      ),
    ).setHours(0 - tzo),
  ).toISOString();

  const days = 8 + buffer;

  return [startDate, days];
}
