import Link from "next/link";

export default function AdminIndex() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <p>Go to the grid editor.</p>
      <Link className="underline" href="/admin/grid">Grid editor</Link>
    </div>
  );
}


