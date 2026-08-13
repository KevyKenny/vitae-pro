
import {
  experienceTypeLabel,
  formatDateRange,
} from "@/features/cv-editor/components/experience/experience-helpers";
import type { ExperienceEntry } from "@/features/cv-editor/types";

type PreviewVariant = "preview" | "document";

const previewClasses = {
  entry: "mt-2",
  title: "text-[0.58rem] font-semibold text-ink",
  meta: "text-[0.5rem] text-ink-faint",
  body: "text-[0.55rem] text-ink-soft",
  bullets: "mt-1 space-y-0.5",
  bulletItem: "text-[0.55rem] text-ink-soft",
};

const documentClasses = {
  entry: "doc-entry",
  title: "doc-entry-title",
  meta: "doc-entry-meta",
  body: "doc-body",
  bullets: "doc-bullets",
  bulletItem: "",
};

export function ExperiencePreview({
  experience,
  variant = "preview",
}: {
  experience: ExperienceEntry[];
  variant?: PreviewVariant;
}) {
  if (experience.length === 0) return null;
  const classes = variant === "document" ? documentClasses : previewClasses;

  return (
    <div>
      {experience.map((entry) => (
        <div key={entry.id} className={classes.entry}>
          {renderEntry(entry, classes)}
        </div>
      ))}
    </div>
  );
}

function Bullets({
  items,
  classes,
}: {
  items: string[];
  classes: typeof previewClasses;
}) {
  const lines = items.map((s) => s.trim()).filter(Boolean);
  if (!lines.length) return null;
  const isDocument = classes.bulletItem === "";
  return (
    <ul className={classes.bullets}>
      {lines.map((line, i) => (
        <li key={i} className={classes.bulletItem || undefined}>
          {isDocument ? line : `— ${line}`}
        </li>
      ))}
    </ul>
  );
}

function renderEntry(
  entry: ExperienceEntry,
  classes: typeof previewClasses,
) {
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
          <p className={classes.title}>{title}</p>
          <p className={classes.meta}>
            {[entry.company, entry.department, entry.location]
              .filter(Boolean)
              .join(" · ")}
          </p>
          {when ? <p className={classes.meta}>{when}</p> : null}
          <Bullets
            items={[...entry.responsibilities, ...entry.achievements]}
            classes={classes}
          />
          {entry.skillsGained.length ? (
            <p className={classes.meta}>
              Skills: {entry.skillsGained.join(" · ")}
            </p>
          ) : null}
          {entry.includeSupervisorOnExport && entry.supervisor.name ? (
            <p className={classes.meta}>
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
          <p className={classes.title}>
            {entry.programmeName || "Graduate Trainee"}
            {entry.department ? ` – ${entry.department}` : ""}
          </p>
          <p className={classes.meta}>
            {[entry.company, entry.location].filter(Boolean).join(" · ")}
          </p>
          <p className={classes.meta}>{formatDateRange(entry)}</p>
          {entry.rotationDetails ? (
            <p className={classes.body}>{entry.rotationDetails}</p>
          ) : null}
          <Bullets
            items={[...entry.responsibilities, ...entry.achievements]}
            classes={classes}
          />
        </>
      );
    case "volunteer":
      return (
        <>
          <p className={classes.title}>
            Volunteer – {entry.role || "Role"}
          </p>
          <p className={classes.meta}>
            {[entry.organization, entry.cause, entry.location]
              .filter(Boolean)
              .join(" · ")}
          </p>
          <p className={classes.meta}>{formatDateRange(entry)}</p>
          {entry.impact ? <p className={classes.body}>{entry.impact}</p> : null}
          <Bullets
            items={[...entry.responsibilities, ...entry.achievements]}
            classes={classes}
          />
        </>
      );
    case "freelance":
      return (
        <>
          <p className={classes.title}>
            Freelance – {entry.projectName || "Project"}
          </p>
          <p className={classes.meta}>
            {[entry.clientName, entry.portfolioLink].filter(Boolean).join(" · ")}
          </p>
          <p className={classes.meta}>
            {entry.dateMode === "duration" && entry.duration
              ? `Duration: ${entry.duration}`
              : formatDateRange(entry)}
          </p>
          {entry.technologies.length ? (
            <p className={classes.meta}>{entry.technologies.join(" · ")}</p>
          ) : null}
          <Bullets items={entry.achievements} classes={classes} />
        </>
      );
    default:
      return (
        <>
          <p className={classes.title}>
            {entry.position}
            {entry.company ? ` · ${entry.company}` : ""}
          </p>
          <p className={classes.meta}>
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
            classes={classes}
          />
        </>
      );
  }
}
