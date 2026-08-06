"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubjectList } from "@/features/cv-editor/components/education/subject-list";
import {
  EXAM_BOARD_OPTIONS,
  type EducationFieldErrors,
} from "@/features/cv-editor/components/education/education-helpers";
import type { ExamSubjectsEducation } from "@/features/cv-editor/types";
import { cn } from "@/lib/utils";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-[0.72rem] text-destructive">{message}</p>;
}

export function ExamSubjectsForm({
  entry,
  onChange,
  errors,
  heading,
}: {
  entry: ExamSubjectsEducation;
  onChange: (next: ExamSubjectsEducation) => void;
  errors: EducationFieldErrors;
  heading: string;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-ink-soft">{heading}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-[0.76rem] uppercase text-ink-soft">
            Examination board
          </Label>
          <Select
            value={entry.examinationBoard}
            onValueChange={(examinationBoard) =>
              onChange({
                ...entry,
                examinationBoard: examinationBoard as ExamSubjectsEducation["examinationBoard"],
              })
            }
          >
            <SelectTrigger className="bg-surface">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EXAM_BOARD_OPTIONS.map((board) => (
                <SelectItem key={board.id} value={board.id}>
                  {board.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {entry.examinationBoard === "other" ? (
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-[0.76rem] uppercase text-ink-soft">
              Board name
            </Label>
            <Input
              value={entry.examinationBoardOther}
              onChange={(e) =>
                onChange({ ...entry, examinationBoardOther: e.target.value })
              }
              aria-invalid={errors.examinationBoardOther ? true : undefined}
              className={cn("bg-surface", errors.examinationBoardOther && "border-destructive")}
            />
            <FieldError message={errors.examinationBoardOther} />
          </div>
        ) : null}
        <div className="space-y-1.5">
          <Label className="text-[0.76rem] uppercase text-ink-soft">
            School name
          </Label>
          <Input
            value={entry.schoolName}
            onChange={(e) => onChange({ ...entry, schoolName: e.target.value })}
            aria-invalid={errors.schoolName ? true : undefined}
            className={cn("bg-surface", errors.schoolName && "border-destructive")}
          />
          <FieldError message={errors.schoolName} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[0.76rem] uppercase text-ink-soft">
            Year completed
          </Label>
          <Input
            value={entry.yearCompleted}
            onChange={(e) => onChange({ ...entry, yearCompleted: e.target.value })}
            placeholder="2022"
            inputMode="numeric"
            aria-invalid={errors.yearCompleted ? true : undefined}
            className={cn("bg-surface", errors.yearCompleted && "border-destructive")}
          />
          <FieldError message={errors.yearCompleted} />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-[0.76rem] uppercase text-ink-soft">
            Candidate number (optional)
          </Label>
          <Input
            value={entry.candidateNumber}
            onChange={(e) =>
              onChange({ ...entry, candidateNumber: e.target.value })
            }
            className="bg-surface"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-[0.76rem] uppercase text-ink-soft">Subjects</Label>
        <SubjectList
          subjects={entry.subjects}
          onChange={(subjects) => onChange({ ...entry, subjects })}
          errors={errors}
        />
      </div>
    </div>
  );
}

export function OLevelForm({
  entry,
  onChange,
  errors,
}: {
  entry: ExamSubjectsEducation;
  onChange: (next: ExamSubjectsEducation) => void;
  errors: EducationFieldErrors;
}) {
  return (
    <ExamSubjectsForm
      entry={entry}
      onChange={onChange}
      errors={errors}
      heading="Ordinary Level details"
    />
  );
}

export function ALevelForm({
  entry,
  onChange,
  errors,
}: {
  entry: ExamSubjectsEducation;
  onChange: (next: ExamSubjectsEducation) => void;
  errors: EducationFieldErrors;
}) {
  return (
    <ExamSubjectsForm
      entry={entry}
      onChange={onChange}
      errors={errors}
      heading="Advanced Level details"
    />
  );
}
