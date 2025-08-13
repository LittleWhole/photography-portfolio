import { Card, CardContent } from "@/components/ui/card";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <section className="max-w-4xl mx-auto space-y-10 text-center">
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight bg-gradient-to-b from-black to-neutral-600 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
          Let&apos;s work together
        </h1>
        <p className="text-lg text-neutral-700 dark:text-neutral-300 max-w-2xl mx-auto">
          Looking to book a session, collaborate, or purchase prints?
          <br className="hidden sm:block" />
          Send a message below and I&apos;ll get back to you.
        </p>
        <p className="text-neutral-600 dark:text-neutral-400">
          Or email me directly at {" "}
          <a className="underline decoration-2 underline-offset-2 hover:text-black dark:hover:text-white transition-colors" href="mailto:davylingphoto@gmail.com">
            davysling@gmail.com
          </a>
        </p>
      </div>
      <div className="mx-auto max-w-2xl">
        <Card className="p-8 sm:p-10">
          <CardContent className="p-0">
            <ContactForm />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}


