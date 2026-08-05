"use client";

import { motion } from "framer-motion";
import { Download, Minus, Plus, Printer } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TemplateSelector } from "@/features/cv-editor/components/template-selector";
import { useEditor } from "@/features/cv-editor/context/editor-context";
import { cn } from "@/lib/utils";

export function CVPreview({ className }: { className?: string }) {
  const { document, zoom, setZoom } = useEditor();
  const { personal, summary, experience, education, skills, projects } =
    document;
  const visible = new Set(
    document.sections.filter((s) => s.visible).map((s) => s.type),
  );

  return (
    <div className={cn("flex h-full flex-col bg-surface", className)}>
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <h2 className="font-sans text-[0.88rem] font-semibold text-ink">
          Live preview
        </h2>
        <div className="flex items-center gap-1 text-[0.78rem] text-ink-soft">
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
          <span className="w-10 text-center">{zoom}%</span>
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
        </div>
      </div>

      <TemplateSelector />

      <div className="flex-1 overflow-y-auto bg-paper-dim p-5">
        <motion.article
          key={document.templateId}
          initial={{ opacity: 0.6, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className={cn(
            "mx-auto origin-top bg-surface shadow-m",
            document.templateId === "creative" && "border-t-4 border-t-gold",
            document.templateId === "executive" && "border-l-4 border-l-emerald",
          )}
          style={{
            width: `${Math.round(320 * (zoom / 100))}px`,
            padding: `${Math.round(28 * (zoom / 100))}px ${Math.round(24 * (zoom / 100))}px`,
            minHeight: `${Math.round(452 * (zoom / 100))}px`,
            fontSize: `${0.6 * (zoom / 100)}rem`,
          }}
        >
          {visible.has("personal") ? (
            <>
              <h1 className="font-serif text-[1.05rem] font-semibold text-ink">
                {personal.fullName}
              </h1>
              <p className="text-[0.65rem] text-ink-soft">{personal.title}</p>
              <p className="mt-1 text-[0.55rem] text-ink-faint">
                {[personal.email, personal.phone, personal.location]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <p className="text-[0.55rem] text-ink-faint">
                {[personal.linkedin, personal.portfolio]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </>
          ) : null}

          {visible.has("summary") && summary ? (
            <>
              <p className="mt-3 border-b border-line pb-1 text-[0.5rem] font-bold tracking-[0.08em] text-emerald uppercase">
                Summary
              </p>
              <p className="mt-1.5 text-[0.58rem] leading-relaxed text-ink">
                {summary}
              </p>
            </>
          ) : null}

          {visible.has("experience") ? (
            <>
              <p className="mt-3 border-b border-line pb-1 text-[0.5rem] font-bold tracking-[0.08em] text-emerald uppercase">
                Experience
              </p>
              {experience.map((exp) => (
                <div key={exp.id} className="mt-2">
                  <p className="text-[0.58rem] font-semibold text-ink">
                    {exp.position}
                    {exp.company ? ` · ${exp.company}` : ""}
                  </p>
                  <p className="text-[0.5rem] text-ink-faint">
                    {exp.startDate}
                    {exp.current ? " — Present" : exp.endDate ? ` — ${exp.endDate}` : ""}
                    {exp.location ? ` · ${exp.location}` : ""}
                  </p>
                  <ul className="mt-1 space-y-0.5">
                    {exp.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className="text-[0.55rem] text-ink-soft">
                        — {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </>
          ) : null}

          {visible.has("education") ? (
            <>
              <p className="mt-3 border-b border-line pb-1 text-[0.5rem] font-bold tracking-[0.08em] text-emerald uppercase">
                Education
              </p>
              {education.map((edu) => (
                <div key={edu.id} className="mt-1.5">
                  <p className="text-[0.58rem] font-semibold text-ink">
                    {edu.degree}
                    {edu.field ? ` · ${edu.field}` : ""}
                  </p>
                  <p className="text-[0.5rem] text-ink-faint">
                    {edu.institution}
                    {edu.endDate ? ` · ${edu.endDate}` : ""}
                  </p>
                </div>
              ))}
            </>
          ) : null}

          {visible.has("skills") ? (
            <>
              <p className="mt-3 border-b border-line pb-1 text-[0.5rem] font-bold tracking-[0.08em] text-emerald uppercase">
                Skills
              </p>
              <p className="mt-1.5 text-[0.55rem] text-ink-soft">
                {skills.map((s) => s.name).join(" · ")}
              </p>
            </>
          ) : null}

          {visible.has("projects") && projects.length > 0 ? (
            <>
              <p className="mt-3 border-b border-line pb-1 text-[0.5rem] font-bold tracking-[0.08em] text-emerald uppercase">
                Projects
              </p>
              {projects.map((p) => (
                <div key={p.id} className="mt-1.5">
                  <p className="text-[0.58rem] font-semibold text-ink">{p.name}</p>
                  <p className="text-[0.55rem] text-ink-soft">{p.description}</p>
                </div>
              ))}
            </>
          ) : null}
        </motion.article>
      </div>

      <div className="flex gap-2 border-t border-line p-3">
        <Button
          type="button"
          variant="outline"
          shape="soft"
          className="flex-1 rounded-[8px]"
          onClick={() => toast.message("Print preview (UI only)")}
        >
          <Printer className="size-4" />
          Print
        </Button>
        <Button
          type="button"
          shape="soft"
          className="flex-1 rounded-[8px]"
          onClick={() => toast.success("Download PDF (UI only)")}
        >
          <Download className="size-4" />
          PDF
        </Button>
      </div>
      <div className="px-4 pb-3">
        <Badge variant="outline">A4 · Real-time</Badge>
      </div>
    </div>
  );
}
