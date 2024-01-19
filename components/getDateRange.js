export function getDateRange(date, buffer) {
  const selectDate = date;
  const startDate = new Date(
    new Date(
      selectDate.setDate(selectDate.getDate() - (selectDate.getDay() + buffer)),
    ).setHours(12),
  ).toISOString();

  const endDate = new Date(
    new Date(
      selectDate.setDate(
        selectDate.getDate() + (7 - selectDate.getDay() + buffer),
      ),
    ).setHours(12),
  ).toISOString();

  const days = 7 + buffer;

  return [startDate, endDate, days];
}
