"use client";

import { GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUBJECT_GRADE_OPTIONS } from "@/features/cv-editor/components/education/education-helpers";
import type { SubjectGrade } from "@/features/cv-editor/types";
import { cn } from "@/lib/utils";

const fieldInputClass =
  "h-10 border-0 bg-paper-dim shadow-none focus-visible:border-line-strong focus-visible:shadow-none";

export function SubjectInput({
  subject,
  onChange,
  onRemove,
  dragHandleProps,
  errorName,
  errorGrade,
  canRemove,
  showHeaders = false,
}: {
  subject: SubjectGrade;
  onChange: (next: SubjectGrade) => void;
  onRemove: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
  errorName?: string;
  errorGrade?: string;
  canRemove: boolean;
  showHeaders?: boolean;
}) {
  return (
    <div className="space-y-1">
      {showHeaders ? (
        <div className="hidden grid-cols-[auto_minmax(0,1fr)_7rem_auto] gap-2 px-1 text-[0.76rem] font-medium text-ink-faint sm:grid">
          <span aria-hidden className="w-8" />
          <span>Subject</span>
          <span>Grade</span>
          <span aria-hidden className="w-8" />
        </div>
      ) : null}
      <div className="grid gap-2 sm:grid-cols-[auto_minmax(0,1fr)_7rem_auto] sm:items-start">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          shape="soft"
          className="mt-0.5 cursor-grab text-ink-faint"
          aria-label={`Reorder ${subject.name || "subject"}`}
          {...dragHandleProps}
        >
          <GripVertical className="size-4" />
        </Button>
        <div className="space-y-1">
          <Input
            value={subject.name}
            onChange={(e) => onChange({ ...subject, name: e.target.value })}
            placeholder="Subject name"
            aria-label="Subject"
            aria-invalid={errorName ? true : undefined}
            className={cn(fieldInputClass, errorName && "border-destructive")}
          />
          {errorName ? (
            <p className="text-[0.72rem] text-destructive">{errorName}</p>
          ) : null}
        </div>
        <div className="space-y-1">
          <Select
            value={subject.grade || undefined}
            onValueChange={(grade) => onChange({ ...subject, grade })}
          >
            <SelectTrigger
              aria-label="Grade"
              aria-invalid={errorGrade ? true : undefined}
              className={cn(fieldInputClass, errorGrade && "border-destructive")}
            >
              <SelectValue placeholder="Grade" />
            </SelectTrigger>
            <SelectContent>
              {SUBJECT_GRADE_OPTIONS.map((grade) => (
                <SelectItem key={grade} value={grade}>
                  {grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errorGrade ? (
            <p className="text-[0.72rem] text-destructive">{errorGrade}</p>
          ) : null}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          shape="soft"
          className="mt-0.5 text-ink-faint hover:text-destructive"
          aria-label="Remove subject"
          disabled={!canRemove}
          onClick={onRemove}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}
