"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockCountries } from "@/mocks/onboarding";
import { cn } from "@/lib/utils";

type CountrySelectorProps = {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

export function CountrySelector({
  value,
  onValueChange,
  placeholder = "Select country",
  className,
  id,
  ...a11y
}: CountrySelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        id={id}
        className={cn(className)}
        aria-invalid={a11y["aria-invalid"]}
        aria-describedby={a11y["aria-describedby"]}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {mockCountries.map((country) => (
          <SelectItem key={country.code} value={country.code}>
            {country.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
