export function getDateRange(date, buffer) {
  const selectDate = new Date(date);
  selectDate.setHours(0);
  const tzo = selectDate.getTimezoneOffset() / 60;
  const startDate = new Date(
    new Date(
      new Date(selectDate.toISOString()).setDate(
        selectDate.getDate() - (selectDate.getDay() + buffer),
      ),
    ).setHours(12 - tzo),
  ).toISOString();

  const endDate = new Date(
    new Date(
      new Date(selectDate.toISOString()).setDate(
        selectDate.getDate() + (7 - selectDate.getDay() + buffer),
      ),
    ).setHours(23 - tzo, 59, 59),
  ).toISOString();

  const days = 8 + buffer;

  return [startDate, endDate, days];
}
