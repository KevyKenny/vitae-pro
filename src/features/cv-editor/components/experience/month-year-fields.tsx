"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MONTH_OPTIONS, YEAR_OPTIONS } from "@/lib/cvs/date-options";
import { cn } from "@/lib/utils";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-[0.72rem] text-destructive">{message}</p>;
}

export function SingleMonthYearFields({
  month,
  year,
  onChange,
  label = "Date",
}: {
  month: string;
  year: string;
  onChange: (patch: { month?: string; year?: string }) => void;
  label?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[0.76rem] uppercase text-ink-soft">{label}</Label>
      <div className="grid grid-cols-2 gap-2">
        <Select
          value={month || undefined}
          onValueChange={(value) => onChange({ month: value })}
        >
          <SelectTrigger className="bg-surface" aria-label="Month">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {MONTH_OPTIONS.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={year || undefined}
          onValueChange={(value) => onChange({ year: value })}
        >
          <SelectTrigger className="bg-surface" aria-label="Year">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {YEAR_OPTIONS.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function MonthYearFields({
  startMonth,
  startYear,
  endMonth,
  endYear,
  current,
  onChange,
  errors = {},
  hideEnd = false,
}: {
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  current?: boolean;
  hideEnd?: boolean;
  onChange: (patch: {
    startMonth?: string;
    startYear?: string;
    endMonth?: string;
    endYear?: string;
  }) => void;
  errors?: Record<string, string>;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="space-y-1.5">
        <Label className="text-[0.76rem] uppercase text-ink-soft">
          Start month
        </Label>
        <Select
          value={startMonth || undefined}
          onValueChange={(v) => onChange({ startMonth: v })}
        >
          <SelectTrigger
            className={cn("bg-surface", errors.startMonth && "border-destructive")}
            aria-invalid={errors.startMonth ? true : undefined}
          >
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {MONTH_OPTIONS.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError message={errors.startMonth} />
      </div>
      <div className="space-y-1.5">
        <Label className="text-[0.76rem] uppercase text-ink-soft">
          Start year
        </Label>
        <Select
          value={startYear || undefined}
          onValueChange={(v) => onChange({ startYear: v })}
        >
          <SelectTrigger
            className={cn("bg-surface", errors.startYear && "border-destructive")}
            aria-invalid={errors.startYear ? true : undefined}
          >
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {YEAR_OPTIONS.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError message={errors.startYear} />
      </div>
      {!hideEnd && !current ? (
        <>
          <div className="space-y-1.5">
            <Label className="text-[0.76rem] uppercase text-ink-soft">
              End month
            </Label>
            <Select
              value={endMonth || undefined}
              onValueChange={(v) => onChange({ endMonth: v })}
            >
              <SelectTrigger
                className={cn("bg-surface", errors.endMonth && "border-destructive")}
                aria-invalid={errors.endMonth ? true : undefined}
              >
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {MONTH_OPTIONS.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={errors.endMonth} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[0.76rem] uppercase text-ink-soft">
              End year
            </Label>
            <Select
              value={endYear || undefined}
              onValueChange={(v) => onChange({ endYear: v })}
            >
              <SelectTrigger
                className={cn("bg-surface", errors.endYear && "border-destructive")}
                aria-invalid={errors.endYear ? true : undefined}
              >
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {YEAR_OPTIONS.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={errors.endYear} />
          </div>
        </>
      ) : null}
    </div>
  );
}
