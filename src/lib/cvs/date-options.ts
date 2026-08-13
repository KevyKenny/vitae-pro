/** Shared calendar options for education + experience date pickers. */

export const MONTH_OPTIONS = [
  { id: "01", label: "January" },
  { id: "02", label: "February" },
  { id: "03", label: "March" },
  { id: "04", label: "April" },
  { id: "05", label: "May" },
  { id: "06", label: "June" },
  { id: "07", label: "July" },
  { id: "08", label: "August" },
  { id: "09", label: "September" },
  { id: "10", label: "October" },
  { id: "11", label: "November" },
  { id: "12", label: "December" },
] as const;

function yearOptions(): string[] {
  const current = new Date().getFullYear() + 1;
  const years: string[] = [];
  for (let year = current; year >= 1970; year -= 1) {
    years.push(String(year));
  }
  return years;
}

export const YEAR_OPTIONS = yearOptions();
