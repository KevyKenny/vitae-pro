import "@/styles/document.css";
import "@/styles/templates.css";

export default function PrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-dvh bg-white print:bg-white">{children}</div>;
}
