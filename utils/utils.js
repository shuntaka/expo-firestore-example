const _getPreviousDate = (date) => {
  date.setDate(date.getDate() - 1);
  return date;
};

const _begginingOfDate = (baseDate) => {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const date = baseDate.getDate();
  return new Date(year, month, date);
};
export const findBegginEndDateForWeek = (date) => {
  let begginDate = date;
  let endDate;
  while (begginDate.getDay() !== 1) {
    begginDate = _getPreviousDate(begginDate);
  }
  begginDate = _begginingOfDate(begginDate);
  endDate = new Date(begginDate);
  endDate.setDate(endDate.getDate() + 6);
  return { begginDate, endDate };
};
