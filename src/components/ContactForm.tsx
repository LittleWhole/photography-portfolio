"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Status = { type: "idle" } | { type: "submitting" } | { type: "success" } | { type: "error"; message: string };

export default function ContactForm() {
  const [status, setStatus] = useState<Status>({ type: "idle" });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    setStatus({ type: "submitting" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data?.error || "Something went wrong");
      }
      setStatus({ type: "success" });
      form.reset();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send message";
      setStatus({ type: "error", message });
    }
  }

  const disabled = status.type === "submitting";

  return (
    <form className="space-y-5 text-left" onSubmit={onSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required placeholder="Your name" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required placeholder="you@example.com" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" placeholder="Booking, collaboration, prints…" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" required rows={6} placeholder="Tell me about your project, dates, location, and any details." />
      </div>
      <div className="flex items-center justify-center gap-3">
        <Button disabled={disabled} type="submit" size="lg">
          {status.type === "submitting" ? "Sending…" : "Send message"}
        </Button>
        {status.type === "success" && <span className="text-sm text-emerald-600 dark:text-emerald-400">Message sent!</span>}
        {status.type === "error" && <span className="text-sm text-red-600 dark:text-red-400">{status.message}</span>}
      </div>
    </form>
  );
}


