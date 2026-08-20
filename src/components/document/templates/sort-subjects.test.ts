import { describe, expect, it } from "vitest";
import {
  educationEntryParts,
  sortSubjectsForDocument,
} from "@/components/document/templates/entries";
import type { EducationEntry } from "@/features/cv-editor/types";

describe("sortSubjectsForDocument", () => {
  it("ranks letter grades strongest-first, then A–Z within a grade", () => {
    const sorted = sortSubjectsForDocument([
      { id: "1", name: "History", grade: "C" },
      { id: "2", name: "English Language", grade: "A" },
      { id: "3", name: "Mathematics", grade: "B" },
      { id: "4", name: "Combined Science", grade: "A" },
      { id: "5", name: "Geography", grade: "B" },
    ]);

    expect(sorted.map((s) => `${s.name} ${s.grade}`)).toEqual([
      "Combined Science A",
      "English Language A",
      "Geography B",
      "Mathematics B",
      "History C",
    ]);
  });

  it("treats A* ahead of A and ZIMSEC 1 ahead of 2", () => {
    const sorted = sortSubjectsForDocument([
      { id: "1", name: "Physics", grade: "A" },
      { id: "2", name: "Chemistry", grade: "A*" },
      { id: "3", name: "Biology", grade: "2" },
      { id: "4", name: "Shona", grade: "1" },
    ]);

    expect(sorted.map((s) => s.grade)).toEqual(["A*", "A", "1", "2"]);
  });
});

describe("educationEntryParts exam subjects", () => {
  it("keeps O-Level subjects in the order the user entered them", () => {
    const entry: EducationEntry = {
      id: "edu_olevel",
      qualificationType: "o-level",
      examinationBoard: "zimsec",
      examinationBoardOther: "",
      schoolName: "ABC High School",
      yearCompleted: "2014",
      candidateNumber: "",
      subjects: [
        { id: "1", name: "English Language", grade: "A" },
        { id: "2", name: "Mathematics", grade: "B" },
        { id: "3", name: "History", grade: "C" },
        { id: "4", name: "Combined Science", grade: "A" },
      ],
    };

    expect(educationEntryParts(entry).subjects.map((s) => s.name)).toEqual([
      "English Language",
      "Mathematics",
      "History",
      "Combined Science",
    ]);
  });
});
