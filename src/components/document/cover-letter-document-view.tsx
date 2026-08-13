import type { CoverLetterDocumentViewProps } from "@/components/document/types";
import type { LetterTemplateId } from "@/features/cover-letter/types";
import { cn } from "@/lib/utils";

function templateClass(templateId: LetterTemplateId): string {
  switch (templateId) {
    case "creative":
      return "doc-template-creative";
    case "executive":
      return "doc-template-executive";
    default:
      return "";
  }
}

function headerClass(templateId: LetterTemplateId): string {
  return templateId === "modern"
    ? "doc-cl-header doc-cl-header--modern"
    : "doc-cl-header";
}

export function CoverLetterDocumentView({
  document,
  mode = "preview",
  pageSize = "a4",
  className,
  style,
}: CoverLetterDocumentViewProps) {
  const { body, templateId } = document;
  const paragraphs = [
    body.greeting,
    body.opening,
    body.experience,
    body.skills,
    body.closing,
  ].filter((p) => p.trim());

  return (
    <div
      className={cn("doc-root", mode === "print" && "doc-root--print", className)}
      style={style}
    >
      <article
        className={cn(
          "doc-page",
          pageSize === "letter" && "doc-page--letter",
          templateClass(templateId),
        )}
      >
        <header className={headerClass(templateId)}>
          <p
            className={cn(
              "doc-cl-name",
              templateId === "executive" ? "text-xl" : "text-lg",
            )}
          >
            {body.headerName}
          </p>
          <p className="doc-cl-meta">{body.headerMeta}</p>
        </header>

        {body.date ? <p className="doc-cl-date">{body.date}</p> : null}

        <div className="doc-cl-body">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="whitespace-pre-wrap">
              {paragraph}
            </p>
          ))}
          {body.signature ? (
            <p className="whitespace-pre-wrap pt-2">{body.signature}</p>
          ) : null}
        </div>
      </article>
    </div>
  );
}
