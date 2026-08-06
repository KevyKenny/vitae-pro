"use client";

import {
  experienceTypeLabel,
  formatDateRange,
} from "@/features/cv-editor/components/experience/experience-helpers";
import type { ExperienceEntry } from "@/features/cv-editor/types";

export function ExperiencePreview({
  experience,
}: {
  experience: ExperienceEntry[];
}) {
  if (experience.length === 0) return null;

  return (
    <div>
      {experience.map((entry) => (
        <div key={entry.id} className="mt-2">
          {renderEntry(entry)}
        </div>
      ))}
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  const lines = items.map((s) => s.trim()).filter(Boolean);
  if (!lines.length) return null;
  return (
    <ul className="mt-1 space-y-0.5">
      {lines.map((line, i) => (
        <li key={i} className="text-[0.55rem] text-ink-soft">
          — {line}
        </li>
      ))}
    </ul>
  );
}

function renderEntry(entry: ExperienceEntry) {
  switch (entry.experienceType) {
    case "industrial-attachment":
    case "internship": {
      const typeLabel = experienceTypeLabel(entry.experienceType);
      const title = [typeLabel, entry.role || entry.department]
        .filter(Boolean)
        .join(" – ");
      const when =
        entry.dateMode === "duration" && entry.duration
          ? `Duration: ${entry.duration}`
          : formatDateRange(entry);
      return (
        <>
          <p className="text-[0.58rem] font-semibold text-ink">{title}</p>
          <p className="text-[0.5rem] text-ink-faint">
            {[entry.company, entry.department, entry.location]
              .filter(Boolean)
              .join(" · ")}
          </p>
          {when ? <p className="text-[0.5rem] text-ink-faint">{when}</p> : null}
          <Bullets
            items={[...entry.responsibilities, ...entry.achievements]}
          />
          {entry.skillsGained.length ? (
            <p className="mt-0.5 text-[0.5rem] text-ink-faint">
              Skills: {entry.skillsGained.join(" · ")}
            </p>
          ) : null}
          {entry.includeSupervisorOnExport && entry.supervisor.name ? (
            <p className="mt-0.5 text-[0.5rem] text-ink-faint">
              Referee: {entry.supervisor.name}
              {entry.supervisor.position
                ? ` · ${entry.supervisor.position}`
                : ""}
            </p>
          ) : null}
        </>
      );
    }
    case "graduate-trainee":
      return (
        <>
          <p className="text-[0.58rem] font-semibold text-ink">
            {entry.programmeName || "Graduate Trainee"}
            {entry.department ? ` – ${entry.department}` : ""}
          </p>
          <p className="text-[0.5rem] text-ink-faint">
            {[entry.company, entry.location].filter(Boolean).join(" · ")}
          </p>
          <p className="text-[0.5rem] text-ink-faint">
            {formatDateRange(entry)}
          </p>
          {entry.rotationDetails ? (
            <p className="text-[0.55rem] text-ink-soft">
              {entry.rotationDetails}
            </p>
          ) : null}
          <Bullets
            items={[...entry.responsibilities, ...entry.achievements]}
          />
        </>
      );
    case "volunteer":
      return (
        <>
          <p className="text-[0.58rem] font-semibold text-ink">
            Volunteer – {entry.role || "Role"}
          </p>
          <p className="text-[0.5rem] text-ink-faint">
            {[entry.organization, entry.cause, entry.location]
              .filter(Boolean)
              .join(" · ")}
          </p>
          <p className="text-[0.5rem] text-ink-faint">
            {formatDateRange(entry)}
          </p>
          {entry.impact ? (
            <p className="text-[0.55rem] text-ink-soft">{entry.impact}</p>
          ) : null}
          <Bullets
            items={[...entry.responsibilities, ...entry.achievements]}
          />
        </>
      );
    case "freelance":
      return (
        <>
          <p className="text-[0.58rem] font-semibold text-ink">
            Freelance – {entry.projectName || "Project"}
          </p>
          <p className="text-[0.5rem] text-ink-faint">
            {[entry.clientName, entry.portfolioLink].filter(Boolean).join(" · ")}
          </p>
          <p className="text-[0.5rem] text-ink-faint">
            {entry.dateMode === "duration" && entry.duration
              ? `Duration: ${entry.duration}`
              : formatDateRange(entry)}
          </p>
          {entry.technologies.length ? (
            <p className="text-[0.5rem] text-ink-faint">
              {entry.technologies.join(" · ")}
            </p>
          ) : null}
          <Bullets items={entry.achievements} />
        </>
      );
    default:
      return (
        <>
          <p className="text-[0.58rem] font-semibold text-ink">
            {entry.position}
            {entry.company ? ` · ${entry.company}` : ""}
          </p>
          <p className="text-[0.5rem] text-ink-faint">
            {[
              experienceTypeLabel(entry.experienceType),
              formatDateRange(entry),
              entry.location,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
          <Bullets
            items={[...entry.responsibilities, ...entry.achievements]}
          />
        </>
      );
  }
}
