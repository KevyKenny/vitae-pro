"use client";

import { motion } from "framer-motion";
import { Minus, Plus, Printer } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCustomize } from "@/features/templates/context/customize-context";
import { EducationPreview } from "@/features/cv-editor/components/education/education-preview";
import { ExperiencePreview } from "@/features/cv-editor/components/experience/experience-preview";
import { mockCvDocument } from "@/mocks/cv-editor";
import { templateFonts } from "@/mocks/templates-gallery";
import { cn } from "@/lib/utils";

export function CVPreviewCustomizer({ className }: { className?: string }) {
  const { customization, zoom, setZoom, template } = useCustomize();
  const font =
    templateFonts.find((f) => f.id === customization.fontFamily)?.stack ??
    templateFonts[0].stack;
  const visible = new Set(
    customization.sections.filter((s) => s.visible).map((s) => s.id),
  );
  const scale = zoom / 100;
  const { personal, summary, experience, education, skills, projects } =
    mockCvDocument;

  const headingFont =
    customization.headingStyle === "sans"
      ? "var(--font-sans), Inter, sans-serif"
      : customization.headingStyle === "mixed"
        ? "var(--font-serif), Fraunces, serif"
        : font;

  return (
    <div className={cn("flex h-full flex-col bg-paper-dim", className)}>
      <div className="flex items-center justify-between border-b border-line bg-surface px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-ink">Preview</h2>
          <p className="text-[0.72rem] text-ink-faint">
            {template.name} · {customization.pageSize.toUpperCase()} · Page 1 of 1
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            shape="soft"
            aria-label="Zoom out"
            onClick={() => setZoom(Math.max(70, zoom - 10))}
          >
            <Minus className="size-3.5" />
          </Button>
          <span className="w-10 text-center font-mono text-[0.72rem]">{zoom}%</span>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            shape="soft"
            aria-label="Zoom in"
            onClick={() => setZoom(Math.min(130, zoom + 10))}
          >
            <Plus className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            shape="soft"
            aria-label="Print preview"
            onClick={() => toast.message("Print preview (UI only)")}
          >
            <Printer className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 justify-center overflow-auto p-3 sm:p-6">
        <motion.article
          key={`${customization.layout}-${customization.fontFamily}-${customization.primaryColor}`}
          initial={{ opacity: 0.7, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className={cn(
            "origin-top shadow-m",
            customization.layout === "sidebar" && "flex gap-4",
            template.editorStyle === "creative" && "border-t-4",
            template.editorStyle === "executive" && "border-l-4",
          )}
          style={{
            width: "min(420px, calc(100vw - 2rem))",
            minHeight: 594,
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            padding: customization.margins * 0.55,
            background: customization.backgroundColor,
            color: customization.textColor,
            fontFamily: font,
            fontSize: customization.fontSize * 0.72,
            lineHeight: customization.bodySpacing,
            borderColor: customization.accentColor,
          }}
        >
          {customization.layout === "sidebar" ? (
            <div
              className="w-[28%] shrink-0 rounded-[6px] p-3 text-[0.85em]"
              style={{ background: customization.primaryColor, color: "#FAF8F3" }}
            >
              <p className="font-semibold">{personal.fullName.split(" ")[0]}</p>
              <p className="mt-2 opacity-80">{personal.email}</p>
              <p className="opacity-80">{personal.phone}</p>
              {visible.has("skills") ? (
                <div className="mt-4">
                  <p className="text-[0.7em] font-bold tracking-wider uppercase opacity-70">
                    Skills
                  </p>
                  <ul className="mt-1 space-y-0.5 opacity-90">
                    {skills.slice(0, 5).map((s) => (
                      <li key={s.id}>{s.name}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}

          <div
            className={cn(
              "min-w-0 flex-1",
              customization.layout === "two-column" && "grid grid-cols-[1fr_0.7fr] gap-4",
            )}
          >
            <div>
              <h1
                className="text-[1.55em] font-semibold"
                style={{ fontFamily: headingFont, color: customization.primaryColor }}
              >
                {personal.fullName}
              </h1>
              <p style={{ color: customization.accentColor }}>{personal.title}</p>
              <p className="mt-1 text-[0.85em] opacity-70">
                {[personal.email, personal.phone, personal.location]
                  .filter(Boolean)
                  .join(" · ")}
              </p>

              {customization.sections
                .filter((s) => s.visible)
                .map((section) => {
                  if (section.id === "summary") {
                    return (
                      <Section
                        key={section.id}
                        title="Summary"
                        color={customization.primaryColor}
                        spacing={customization.sectionSpacing}
                      >
                        <p>{summary}</p>
                      </Section>
                    );
                  }
                  if (section.id === "experience") {
                    return (
                      <Section
                        key={section.id}
                        title="Experience"
                        color={customization.primaryColor}
                        spacing={customization.sectionSpacing}
                      >
                        <ExperiencePreview experience={experience} />
                      </Section>
                    );
                  }
                  if (section.id === "education") {
                    return (
                      <Section
                        key={section.id}
                        title="Education"
                        color={customization.primaryColor}
                        spacing={customization.sectionSpacing}
                      >
                        <EducationPreview education={education} compact />
                      </Section>
                    );
                  }
                  if (section.id === "skills" && customization.layout !== "sidebar") {
                    return (
                      <Section
                        key={section.id}
                        title="Skills"
                        color={customization.primaryColor}
                        spacing={customization.sectionSpacing}
                      >
                        <p>{skills.map((s) => s.name).join(" · ")}</p>
                      </Section>
                    );
                  }
                  if (section.id === "projects") {
                    return (
                      <Section
                        key={section.id}
                        title="Projects"
                        color={customization.primaryColor}
                        spacing={customization.sectionSpacing}
                      >
                        {projects.slice(0, 2).map((p) => (
                          <p key={p.id} className="mb-1">
                            <span className="font-semibold">{p.name}</span> —{" "}
                            {p.description.slice(0, 90)}…
                          </p>
                        ))}
                      </Section>
                    );
                  }
                  if (section.id === "languages") {
                    return (
                      <Section
                        key={section.id}
                        title="Languages"
                        color={customization.primaryColor}
                        spacing={customization.sectionSpacing}
                      >
                        <p>English · French</p>
                      </Section>
                    );
                  }
                  if (section.id === "certificates") {
                    return (
                      <Section
                        key={section.id}
                        title="Certificates"
                        color={customization.primaryColor}
                        spacing={customization.sectionSpacing}
                      >
                        <p>Google UX Certificate · 2023</p>
                      </Section>
                    );
                  }
                  return null;
                })}
            </div>

            {customization.layout === "two-column" ? (
              <div className="text-[0.9em]">
                {visible.has("skills") ? (
                  <Section
                    title="Skills"
                    color={customization.primaryColor}
                    spacing={customization.sectionSpacing}
                  >
                    <ul>
                      {skills.map((s) => (
                        <li key={s.id}>{s.name}</li>
                      ))}
                    </ul>
                  </Section>
                ) : null}
              </div>
            ) : null}
          </div>
        </motion.article>
      </div>
    </div>
  );
}

function Section({
  title,
  color,
  spacing,
  children,
}: {
  title: string;
  color: string;
  spacing: number;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginTop: spacing * 0.7 }}>
      <p
        className="border-b pb-0.5 text-[0.75em] font-bold tracking-[0.08em] uppercase"
        style={{ borderColor: `${color}33`, color }}
      >
        {title}
      </p>
      <div className="mt-1.5">{children}</div>
    </section>
  );
}
