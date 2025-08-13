import Link from "next/link";

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight text-xl">
          Davy Ling
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link className="hover:underline underline-offset-4" href="/work">
            Work
          </Link>
          <Link className="hover:underline underline-offset-4" href="/about">
            About
          </Link>
          <Link className="hover:underline underline-offset-4" href="/contact">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}


