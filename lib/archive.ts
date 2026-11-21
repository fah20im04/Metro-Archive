import { DEPARTMENTS } from "@/app/data/department";

// Department names an archive can belong to (CSE, BBA, EEE, ...)
export const ARCHIVE_DEPARTMENTS: string[] = DEPARTMENTS.map((d) => d.name);

// Semesters follow "year.term": 4 years, 3 terms each (1.1 ... 4.3)
export const SEMESTERS: string[] = [1, 2, 3, 4].flatMap((year) =>
  [1, 2, 3].map((term) => `${year}.${term}`)
);

const ORDINALS = ["", "1st", "2nd", "3rd", "4th"];

// "3.3" -> "3rd Year, 3rd Semester"
export function semesterLabel(semester: string) {
  const [year, term] = semester.split(".").map(Number);
  return `${ORDINALS[year] ?? year} Year, ${ORDINALS[term] ?? term} Semester`;
}

// Archive titles are always generated, never typed: "3.3 - CSE - 60"
export function buildArchiveTitle(
  semester: string,
  department: string,
  batch: string
) {
  return `${semester} - ${department} - ${batch}`;
}
