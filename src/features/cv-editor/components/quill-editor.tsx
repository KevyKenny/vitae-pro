"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="min-h-28 animate-pulse rounded-[8px] border border-line bg-paper-dim" />
  ),
});

const TOOLBAR = [
  ["bold", "italic", "underline"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link"],
  ["clean"],
];

type QuillEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
};

export function QuillEditor({
  value,
  onChange,
  placeholder,
  className,
  label = "Rich text editor",
}: QuillEditorProps) {
  const modules = useMemo(
    () => ({
      toolbar: TOOLBAR,
      clipboard: { matchVisual: false },
    }),
    [],
  );

  return (
    <div
      className={cn("cv-quill rounded-[8px] border border-line bg-paper", className)}
      aria-label={label}
    >
      <ReactQuill
        theme="snow"
        value={value}
        onChange={(html) => onChange(html === "<p><br></p>" ? "" : html)}
        modules={modules}
        placeholder={placeholder}
      />
    </div>
  );
}
