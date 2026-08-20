"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/components/ui/form-field";
import { EmptyState } from "@/components/shared/empty-state";
import { contactTopics } from "@/mocks/public-pages";

const contactSchema = z.object({
  fullName: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  subject: z.string().min(3, "Add a short subject"),
  category: z.string().min(1, "Choose a category"),
  message: z.string().min(10, "Tell us a bit more (at least 10 characters)"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const router = useRouter();
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit, reset } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      email: "",
      subject: "",
      category: "",
      message: "",
    },
  });

  const onSubmit = handleSubmit(async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    setSent(true);
    toast.success("Message queued (demo)", {
      description: "No backend yet — this is a mocked success state.",
    });
  });

  if (sent) {
    return (
      <EmptyState
        icon={CheckCircle2}
        title="Message sent"
        description="Thanks for reaching out. In production we’ll email a confirmation and route your note to the right team."
        guidance="This demo doesn’t deliver mail yet."
        actionLabel="Send another"
        onAction={() => {
          reset();
          setSent(false);
        }}
        secondaryLabel="Back home"
        onSecondary={() => router.push("/")}
      />
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-[16px] border border-line bg-surface p-5 shadow-s sm:p-7"
      noValidate
    >
      <div className="text-center">
        <h2 className="font-serif text-2xl font-semibold text-ink">
          Send a message
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          We typically reply within two business days.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField control={control} name="fullName" label="Full name">
          {({ id, field, ...a11y }) => (
            <Input
              id={id}
              autoComplete="name"
              placeholder="Alex Morgan"
              {...field}
              {...a11y}
            />
          )}
        </FormField>
        <FormField control={control} name="email" label="Email">
          {({ id, field, ...a11y }) => (
            <Input
              id={id}
              type="email"
              autoComplete="email"
              placeholder="alex@email.com"
              {...field}
              {...a11y}
            />
          )}
        </FormField>
      </div>

      <FormField control={control} name="subject" label="Subject">
        {({ id, field, ...a11y }) => (
          <Input
            id={id}
            placeholder="How can we help?"
            {...field}
            {...a11y}
          />
        )}
      </FormField>

      <FormField control={control} name="category" label="Category">
        {({ id, field, ...a11y }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger id={id} aria-label="Category" {...a11y}>
              <SelectValue placeholder="Select a topic" />
            </SelectTrigger>
            <SelectContent>
              {contactTopics.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </FormField>

      <FormField control={control} name="message" label="Message">
        {({ id, field, ...a11y }) => (
          <Textarea
            id={id}
            rows={6}
            placeholder="Share as much context as you’re comfortable with…"
            className="min-h-[140px] resize-y"
            {...field}
            {...a11y}
          />
        )}
      </FormField>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <Button type="submit" shape="soft" disabled={submitting}>
          {submitting ? "Sending…" : "Send Message"}
        </Button>
        <p className="text-[0.78rem] text-ink-faint">
          Demo form — nothing is stored remotely.
        </p>
      </div>
    </form>
  );
}
