export function getDayNameService(dayNumber) {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  if (dayNumber < 0 || dayNumber > 6 || typeof dayNumber !== 'number') {
    throw new Error("Invalid day number");
  }
  return daysOfWeek[dayNumber];
}

export function getStartAndEndTimeService(startDate, endDate){
  const startTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0, 0 ).getTime();
  const endTime = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59, 999 ).getTime();

  return {startTime, endTime};
}


export function getFormattedDateService(date){
  if(!(date instanceof Date)){
    return 'invalid date'
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  const formattedDate = `${day}-${month}-${year}`;
  return formattedDate;
}

// 1736274600000
// 1736447399999