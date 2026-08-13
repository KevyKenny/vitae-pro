"use client";

import { useState } from "react";
import { Camera, MoreVertical, Plus } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditorSectionCard } from "@/features/cv-editor/components/editor-section-card";
import { SectionSaveBar } from "@/features/cv-editor/components/section-save-bar";
import { useEditor } from "@/features/cv-editor/context/editor-context";
import { useSectionId } from "@/features/cv-editor/hooks/use-section-id";
import { useSectionSave } from "@/features/cv-editor/hooks/use-section-save";
import type {
  PersonalCustomField,
  PersonalInfo,
  PersonalOptionalFieldKey,
} from "@/features/cv-editor/types";
import {
  ADDABLE_OPTIONAL_FIELDS,
  OPTIONAL_FIELD_LABELS,
  OPTIONAL_FIELD_VALUE_KEYS,
  isOptionalFieldVisible,
  normalizePersonalInfo,
  syncPersonalLegacyFields,
} from "@/lib/cvs/personal-info";
import { cn } from "@/lib/utils";

const fieldInputClass =
  "h-10 border-0 bg-paper-dim shadow-none focus-visible:border-line-strong focus-visible:shadow-none";

type RemovableFieldKey = Extract<
  PersonalOptionalFieldKey,
  "driversLicense" | "website" | "linkedin"
>;

const DEFAULT_VISIBLE_FIELDS: RemovableFieldKey[] = [
  "driversLicense",
  "website",
  "linkedin",
];

function FieldLabel({
  htmlFor,
  label,
  onRemove,
}: {
  htmlFor?: string;
  label: string;
  onRemove?: () => void;
}) {
  return (
    <div className="mb-1.5 flex items-center justify-between gap-2">
      <Label
        htmlFor={htmlFor}
        className="text-[0.82rem] font-medium text-ink-soft"
      >
        {label}
      </Label>
      {onRemove ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="rounded-md p-1 text-ink-faint transition-colors hover:bg-paper-dim hover:text-ink"
              aria-label={`${label} options`}
            >
              <MoreVertical className="size-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onRemove}>Remove field</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  );
}

function AddFieldButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-3 py-1.5 text-[0.82rem] font-medium text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
    >
      <Plus className="size-3.5 shrink-0" aria-hidden />
      {label}
    </button>
  );
}

export function PersonalInfoSection() {
  const { document, updateDocument } = useEditor();
  const sectionId = useSectionId("personal");
  const { dirty, status, onSave } = useSectionSave("personal");
  const personal = normalizePersonalInfo(document.personal);
  const [customLabelDraft, setCustomLabelDraft] = useState("");
  const [addingCustomField, setAddingCustomField] = useState(false);

  function patchPersonal(updates: Partial<PersonalInfo>) {
    updateDocument(
      (prev) => ({
        ...prev,
        personal: syncPersonalLegacyFields({ ...prev.personal, ...updates }),
      }),
      { sectionKey: "personal" },
    );
  }

  function setFieldVisibility(
    key: PersonalOptionalFieldKey,
    visible: boolean,
  ) {
    patchPersonal({
      fieldVisibility: {
        ...personal.fieldVisibility,
        [key]: visible,
      },
    });
  }

  function showOptionalField(key: PersonalOptionalFieldKey) {
    setFieldVisibility(key, true);
  }

  function hideOptionalField(key: PersonalOptionalFieldKey) {
    setFieldVisibility(key, false);
  }

  function addCustomField() {
    const label = customLabelDraft.trim();
    if (!label) return;
    const nextField: PersonalCustomField = {
      id: crypto.randomUUID(),
      label,
      value: "",
    };
    patchPersonal({
      customFields: [...personal.customFields, nextField],
    });
    setCustomLabelDraft("");
    setAddingCustomField(false);
  }

  function updateCustomField(
    id: string,
    updates: Partial<Pick<PersonalCustomField, "label" | "value">>,
  ) {
    patchPersonal({
      customFields: personal.customFields.map((field) =>
        field.id === id ? { ...field, ...updates } : field,
      ),
    });
  }

  function removeCustomField(id: string) {
    patchPersonal({
      customFields: personal.customFields.filter((field) => field.id !== id),
    });
  }

  const initials = personal.fullName
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("");

  const hiddenAddButtons = ADDABLE_OPTIONAL_FIELDS.filter(
    (key) => !isOptionalFieldVisible(personal, key),
  );

  return (
    <EditorSectionCard sectionId={sectionId} title="Personal Details">
      <div className="grid gap-x-4 gap-y-4 sm:grid-cols-[112px_minmax(0,1fr)]">
        <div className="row-span-2">
          <button
            type="button"
            className="flex size-[112px] items-center justify-center rounded-lg bg-paper-dim text-ink-faint transition-colors hover:bg-line/40"
            aria-label="Add profile photo"
            onClick={() =>
              toast.message("Change photo", {
                description: "Photo upload will be available in a later phase.",
              })
            }
          >
            {personal.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={personal.photoUrl}
                alt=""
                className="size-full rounded-lg object-cover"
              />
            ) : initials ? (
              <span className="font-serif text-2xl font-semibold text-gold">
                {initials}
              </span>
            ) : (
              <Camera className="size-7" strokeWidth={1.5} />
            )}
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="given-name" label="Given name" />
            <Input
              id="given-name"
              value={personal.givenName}
              onChange={(e) => patchPersonal({ givenName: e.target.value })}
              className={fieldInputClass}
              autoComplete="given-name"
            />
          </div>
          <div>
            <FieldLabel htmlFor="family-name" label="Family name" />
            <Input
              id="family-name"
              value={personal.familyName}
              onChange={(e) => patchPersonal({ familyName: e.target.value })}
              className={fieldInputClass}
              autoComplete="family-name"
            />
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <Label
              htmlFor="desired-job-position"
              className="text-[0.82rem] font-medium text-ink-soft"
            >
              Desired job position
            </Label>
            <label className="inline-flex cursor-pointer items-center gap-2 text-[0.78rem] font-medium text-ink-soft">
              <Switch
                checked={personal.useAsHeadline}
                onCheckedChange={(checked) =>
                  patchPersonal({ useAsHeadline: checked })
                }
                className="data-[state=checked]:bg-[#7c3aed]"
                aria-label="Use as headline"
              />
              Use as headline
            </label>
          </div>
          <Input
            id="desired-job-position"
            value={personal.title}
            onChange={(e) => patchPersonal({ title: e.target.value })}
            className={fieldInputClass}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="email-address" label="Email address" />
          <Input
            id="email-address"
            type="email"
            value={personal.email}
            onChange={(e) => patchPersonal({ email: e.target.value })}
            className={fieldInputClass}
            autoComplete="email"
          />
        </div>
        <div>
          <FieldLabel htmlFor="phone-number" label="Phone number" />
          <Input
            id="phone-number"
            type="tel"
            value={personal.phone}
            onChange={(e) => patchPersonal({ phone: e.target.value })}
            className={fieldInputClass}
            autoComplete="tel"
          />
        </div>
      </div>

      <div className="mt-4">
        <FieldLabel htmlFor="address" label="Address" />
        <Input
          id="address"
          value={personal.address}
          onChange={(e) => patchPersonal({ address: e.target.value })}
          className={fieldInputClass}
          autoComplete="street-address"
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="post-code" label="Post code" />
          <Input
            id="post-code"
            value={personal.postCode}
            onChange={(e) => patchPersonal({ postCode: e.target.value })}
            className={fieldInputClass}
            autoComplete="postal-code"
          />
        </div>
        <div>
          <FieldLabel htmlFor="city" label="City" />
          <Input
            id="city"
            value={personal.city}
            onChange={(e) => patchPersonal({ city: e.target.value })}
            className={fieldInputClass}
            autoComplete="address-level2"
          />
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {DEFAULT_VISIBLE_FIELDS.map((key) => {
          if (!isOptionalFieldVisible(personal, key)) return null;
          const fieldId = key === "website" ? "website" : key;
          const value =
            key === "website" ? personal.portfolio : personal[key as "driversLicense" | "linkedin"];

          return (
            <div key={key}>
              <FieldLabel
                htmlFor={fieldId}
                label={OPTIONAL_FIELD_LABELS[key]}
                onRemove={() => hideOptionalField(key)}
              />
              <Input
                id={fieldId}
                value={value}
                onChange={(e) =>
                  patchPersonal(
                    key === "website"
                      ? { portfolio: e.target.value }
                      : { [key]: e.target.value },
                  )
                }
                className={fieldInputClass}
              />
            </div>
          );
        })}

        {ADDABLE_OPTIONAL_FIELDS.map((key) => {
          if (!isOptionalFieldVisible(personal, key)) return null;
          const valueKey = OPTIONAL_FIELD_VALUE_KEYS[key];
          const value = personal[valueKey];
          return (
            <div key={key}>
              <FieldLabel
                htmlFor={key}
                label={OPTIONAL_FIELD_LABELS[key]}
                onRemove={() => hideOptionalField(key)}
              />
              <Input
                id={key}
                value={typeof value === "string" ? value : ""}
                onChange={(e) =>
                  patchPersonal({ [valueKey]: e.target.value } as Partial<PersonalInfo>)
                }
                className={fieldInputClass}
                type={key === "dateOfBirth" ? "date" : "text"}
              />
            </div>
          );
        })}

        {personal.customFields.map((field) => (
          <div key={field.id}>
            <FieldLabel
              htmlFor={`custom-${field.id}`}
              label={field.label || "Custom field"}
              onRemove={() => removeCustomField(field.id)}
            />
            <Input
              id={`custom-${field.id}`}
              value={field.value}
              onChange={(e) =>
                updateCustomField(field.id, { value: e.target.value })
              }
              className={fieldInputClass}
            />
          </div>
        ))}
      </div>

      {(hiddenAddButtons.length > 0 ||
        !addingCustomField ||
        DEFAULT_VISIBLE_FIELDS.some(
          (key) => !isOptionalFieldVisible(personal, key),
        )) && (
        <div className="mt-5 flex flex-wrap gap-2">
          {DEFAULT_VISIBLE_FIELDS.filter(
            (key) => !isOptionalFieldVisible(personal, key),
          ).map((key) => (
            <AddFieldButton
              key={key}
              label={OPTIONAL_FIELD_LABELS[key]}
              onClick={() => showOptionalField(key)}
            />
          ))}
          {hiddenAddButtons.map((key) => (
            <AddFieldButton
              key={key}
              label={OPTIONAL_FIELD_LABELS[key]}
              onClick={() => showOptionalField(key)}
            />
          ))}
          {addingCustomField ? (
            <div className="flex w-full flex-wrap items-center gap-2">
              <Input
                value={customLabelDraft}
                onChange={(e) => setCustomLabelDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomField();
                  }
                }}
                placeholder="Field label"
                className={cn(fieldInputClass, "max-w-xs")}
                aria-label="Custom field label"
                autoFocus
              />
              <AddFieldButton label="Add custom field" onClick={addCustomField} />
              <button
                type="button"
                className="text-[0.82rem] text-ink-faint hover:text-ink"
                onClick={() => {
                  setAddingCustomField(false);
                  setCustomLabelDraft("");
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <AddFieldButton
              label="Custom field"
              onClick={() => setAddingCustomField(true)}
            />
          )}
        </div>
      )}

      <SectionSaveBar
        dirty={dirty}
        status={status}
        onSave={onSave}
        label="Save Personal Information"
        className="mt-6"
      />
    </EditorSectionCard>
  );
}
