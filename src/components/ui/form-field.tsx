"use client";

import * as React from "react";
import {
  Controller,
  type Control,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
  className?: string;
  children: (props: {
    id: string;
    field: ControllerRenderProps<T, FieldPath<T>>;
    "aria-invalid"?: boolean;
    "aria-describedby"?: string;
  }) => React.ReactNode;
};

/** Thin RHF wrapper — keeps label/error wiring consistent. */
export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  className,
  children,
}: FormFieldProps<T>) {
  const id = React.useId();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const errorId = `${id}-error`;
        const descriptionId = `${id}-description`;
        const describedBy = [
          description ? descriptionId : null,
          fieldState.error ? errorId : null,
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <div className={cn("space-y-2", className)}>
            <Label htmlFor={id}>{label}</Label>
            {children({
              id,
              field,
              "aria-invalid": fieldState.error ? true : undefined,
              "aria-describedby": describedBy || undefined,
            })}
            {description ? (
              <p id={descriptionId} className="text-xs text-ink-faint">
                {description}
              </p>
            ) : null}
            {fieldState.error?.message ? (
              <p id={errorId} className="text-xs font-medium text-destructive">
                {fieldState.error.message}
              </p>
            ) : null}
          </div>
        );
      }}
    />
  );
}
