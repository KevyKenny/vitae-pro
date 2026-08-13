"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FilePlus2,
  FileUp,
  LayoutTemplate,
  Mail,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateCv } from "@/features/cv-editor/hooks/use-create-cv";

const actions = [
  {
    id: "qa_cv",
    title: "Create my CV",
    description: "Guided setup or start from scratch — we help at every step.",
    cta: "Create CV",
    icon: FilePlus2,
    onClick: "create",
  },
  {
    id: "qa_letter",
    title: "Generate Cover Letter",
    description: "Match tone to a target role in a few guided prompts.",
    href: "/cover-letter",
    cta: "Generate",
    icon: Mail,
  },
  {
    id: "qa_import",
    title: "Import Existing CV",
    description: "Upload a PDF or Word draft — import parsing coming soon.",
    href: "/cvs/new",
    cta: "Learn more",
    icon: FileUp,
  },
  {
    id: "qa_templates",
    title: "Browse Templates",
    description: "Explore professional layouts before you add content.",
    href: "/templates",
    cta: "Browse",
    icon: LayoutTemplate,
  },
] as const;

export function DashboardQuickActions() {
  const { creating, createAndOpen } = useCreateCv();

  return (
    <section aria-label="Quick actions">
      <h2 className="mb-4 font-serif text-xl font-semibold text-ink">
        Quick actions
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;
          const isCreate = "onClick" in action && action.onClick === "create";
          return (
            <motion.article
              key={action.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.15 }}
              className="flex min-w-0 flex-col rounded-[14px] border border-line bg-surface p-4 shadow-s sm:p-5"
            >
              <div className="flex items-start gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-[12px] bg-paper-dim text-emerald">
                  <Icon className="size-5" aria-hidden />
                </div>
                <h3 className="min-w-0 pt-2 text-base font-semibold leading-snug text-ink">
                  {action.title}
                </h3>
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
                {action.description}
              </p>
              {isCreate ? (
                <Button
                  type="button"
                  shape="soft"
                  className="mt-4 h-11 w-full rounded-[8px] sm:h-10"
                  disabled={creating}
                  onClick={() => void createAndOpen()}
                >
                  <Sparkles className="size-4" />
                  {creating ? "Opening…" : action.cta}
                </Button>
              ) : "href" in action ? (
                <Button
                  asChild
                  shape="soft"
                  className="mt-4 h-11 w-full rounded-[8px] sm:h-10"
                >
                  <Link href={action.href}>{action.cta}</Link>
                </Button>
              ) : null}
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
