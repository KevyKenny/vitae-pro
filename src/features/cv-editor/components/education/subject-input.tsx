"use client";

import { GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export function SubjectInput({
  subject,
  onChange,
  onRemove,
  dragHandleProps,
  errorName,
  errorGrade,
  canRemove,
}: {
  subject: SubjectGrade;
  onChange: (next: SubjectGrade) => void;
  onRemove: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
  errorName?: string;
  errorGrade?: string;
  canRemove: boolean;
}) {
  return (
    <div className="grid gap-2 rounded-[10px] border border-line bg-surface p-3 sm:grid-cols-[auto_1fr_7rem_auto]">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        shape="soft"
        className="cursor-grab text-ink-faint"
        aria-label={`Reorder ${subject.name || "subject"}`}
        {...dragHandleProps}
      >
        <GripVertical className="size-4" />
      </Button>
      <div className="space-y-1.5">
        <Label className="sr-only">Subject</Label>
        <Input
          value={subject.name}
          onChange={(e) => onChange({ ...subject, name: e.target.value })}
          placeholder="Subject name"
          aria-invalid={errorName ? true : undefined}
          className={cn(errorName && "border-destructive")}
        />
        {errorName ? (
          <p className="text-[0.72rem] text-destructive">{errorName}</p>
        ) : null}
      </div>
      <div className="space-y-1.5">
        <Label className="sr-only">Grade</Label>
        <Select
          value={subject.grade || undefined}
          onValueChange={(grade) => onChange({ ...subject, grade })}
        >
          <SelectTrigger
            aria-label="Grade"
            aria-invalid={errorGrade ? true : undefined}
            className={cn(errorGrade && "border-destructive")}
          >
            <SelectValue placeholder="Grade" />
          </SelectTrigger>
          <SelectContent>
            {SUBJECT_GRADE_OPTIONS.map((g) => (
              <SelectItem key={g} value={g}>
                {g}
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
        aria-label="Remove subject"
        disabled={!canRemove}
        onClick={onRemove}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}
