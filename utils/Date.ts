export function getThisWeekMonday(currentDate: Date): Date {
  const currentDay = currentDate.getDay(); // Sunday is 0, Monday is 1, ..., Saturday is 6
  const daysSinceMonday = currentDay === 0 ? 6 : currentDay - 1;

  const mondayDate = new Date(currentDate);
  mondayDate.setDate(currentDate.getDate() - daysSinceMonday);

  return mondayDate;
}

export function formatDateAgo(inputDate: string): string {
  const currentDate = new Date();
  const inputDateObject = new Date(inputDate);

  const timeDifference = currentDate.getTime() - inputDateObject.getTime();

  const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  if (daysAgo === 0) {
    return "Today";
  } else if (daysAgo === 1) {
    return "1 day ago";
  } else {
    return `${daysAgo} days ago`;
  }
}

export function formatDateLongMonth(dateString: string): string {
  const [year, month, day] = dateString.split("-");
  const monthName = new Date(`${year}-${month}-01`).toLocaleString("default", {
    month: "long",
  });
  return `${monthName} ${year}`;
}

export function getCurrentMonth(): string {
  const currentDate = new Date();
  const monthIndex = currentDate.getMonth() + 1;
  const formattedMonth = monthIndex.toString().padStart(2, "0");
  return formattedMonth;
}

export function getCurrentYear(): string {
  const currentYear = new Date();

  return currentYear.getFullYear().toString();
}
