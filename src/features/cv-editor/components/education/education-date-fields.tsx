"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MONTH_OPTIONS, YEAR_OPTIONS } from "@/lib/cvs/date-options";
import { cn } from "@/lib/utils";

const selectClass =
  "h-10 border-0 bg-paper-dim shadow-none focus-visible:border-line-strong focus-visible:shadow-none";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-[0.72rem] text-destructive">{message}</p>;
}

export function EducationDateRangeFields({
  startMonth,
  startYear,
  endMonth,
  endYear,
  current,
  onChange,
  errors = {},
  showPresent = true,
  presentLabel = "Present",
}: {
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  current: boolean;
  onChange: (patch: {
    startMonth?: string;
    startYear?: string;
    endMonth?: string;
    endYear?: string;
    current?: boolean;
  }) => void;
  errors?: Record<string, string>;
  showPresent?: boolean;
  presentLabel?: string;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-[0.82rem] font-medium text-ink-soft">
          Start date
        </Label>
        <div className="mt-1.5 grid grid-cols-2 gap-3">
          <Select
            value={startMonth || undefined}
            onValueChange={(value) => onChange({ startMonth: value })}
          >
            <SelectTrigger
              className={cn(selectClass, errors.startMonth && "border-destructive")}
              aria-invalid={errors.startMonth ? true : undefined}
            >
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {MONTH_OPTIONS.map((month) => (
                <SelectItem key={month.id} value={month.id}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={startYear || undefined}
            onValueChange={(value) => onChange({ startYear: value })}
          >
            <SelectTrigger
              className={cn(selectClass, errors.startYear && "border-destructive")}
              aria-invalid={errors.startYear ? true : undefined}
            >
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {YEAR_OPTIONS.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <FieldError message={errors.startMonth ?? errors.startYear} />
      </div>

      <div>
        <div className="mb-1.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <Label className="text-[0.82rem] font-medium text-ink-soft">
            End date
          </Label>
          {showPresent ? (
            <label className="inline-flex cursor-pointer items-center gap-2 text-[0.78rem] font-medium text-ink-soft">
              <Switch
                checked={current}
                onCheckedChange={(checked) => onChange({ current: checked })}
                className="data-[state=checked]:bg-[#7c3aed]"
                aria-label={presentLabel}
              />
              {presentLabel}
            </label>
          ) : null}
        </div>
        {!current || !showPresent ? (
          <div className="grid grid-cols-2 gap-3">
            <Select
              value={endMonth || undefined}
              onValueChange={(value) => onChange({ endMonth: value })}
            >
              <SelectTrigger
                className={cn(selectClass, errors.endMonth && "border-destructive")}
                aria-invalid={errors.endMonth ? true : undefined}
              >
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {MONTH_OPTIONS.map((month) => (
                  <SelectItem key={month.id} value={month.id}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={endYear || undefined}
              onValueChange={(value) => onChange({ endYear: value })}
            >
              <SelectTrigger
                className={cn(selectClass, errors.endYear && "border-destructive")}
                aria-invalid={errors.endYear ? true : undefined}
              >
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {YEAR_OPTIONS.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}
        <FieldError message={errors.endMonth ?? errors.endYear} />
      </div>
    </div>
  );
}
