export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className="mx-auto max-w-6xl p-6 text-sm text-neutral-800">
        {children}
      </body>
    </html>
  );
}


