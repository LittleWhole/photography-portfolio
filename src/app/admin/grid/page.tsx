"use client";

import { useEffect, useMemo, useState } from "react";
import genresData from "@/data/genres.json";

function authOk() {
  if (typeof window === "undefined") return false;
  const u = prompt("Username:");
  const p = u === null ? null : prompt("Password:");
  return u === "littlewhole" && p === "grideditor";
}

type Tile = { src: string; w: number; h: number; c?: number; r?: number };

async function listImages(slug: string): Promise<string[]> {
  try {
    const res = await fetch(`/api/files/${slug}`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as { files: string[] };
    return data.files || [];
  } catch {
    return [];
  }
}

export default function GridEditor() {
  const [allowed, setAllowed] = useState(false);
  const [genre, setGenre] = useState<string>(Object.keys(genresData)[0] || "");
  const [tiles, setTiles] = useState<Tile[]>([]);

  useEffect(() => {
    setAllowed(authOk());
  }, []);

  useEffect(() => {
    if (!allowed || !genre) return;
    (async () => {
      await load();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowed, genre]);

  const totalCols = 12;

  const [files, setFiles] = useState<string[]>([]);
  useEffect(() => {
    if (!genre) return;
    listImages(genre).then(setFiles);
  }, [genre]);

  const addTile = () => setTiles((t) => [...t, { src: files[0] ? `/photos/${genre}/${files[0]}` : `/photos/${genre}/example.jpg`, w: 4, h: 3 }]);
  const updateTile = (i: number, patch: Partial<Tile>) =>
    setTiles((t) => t.map((tile, idx) => (idx === i ? { ...tile, ...patch } : tile)));
  const removeTile = (i: number) => setTiles((t) => t.filter((_, idx) => idx !== i));

  const load = async () => {
    try {
      const res = await fetch("/api/layouts", { cache: "no-store" });
      const data = (await res.json()) as Record<string, Tile[]>;
      const list = data[genre];
      setTiles(Array.isArray(list) ? list : []);
    } catch {
      setTiles([]);
    }
  };

  const save = async () => {
    const resCurrent = await fetch("/api/layouts", { cache: "no-store" });
    const current = (await resCurrent.json()) as Record<string, Tile[]>;
    const res = await fetch("/api/layouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Basic " + btoa("littlewhole:grideditor"),
      },
      body: JSON.stringify({ ...current, [genre]: tiles }),
    });
    if (!res.ok) alert("Failed to save");
  };

  if (!allowed) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Grid editor</h1>
        <select className="rounded border px-2 py-1 text-sm" value={genre} onChange={(e) => setGenre(e.target.value)}>
          {Object.keys(genresData).map((g) => (
            <option key={g} value={g}>{genresData[g as keyof typeof genresData].title || g}</option>
          ))}
        </select>
        <button className="rounded border px-3 py-1 text-sm" onClick={load}>Load</button>
        <button className="rounded border px-3 py-1 text-sm" onClick={addTile}>
          Add tile
        </button>
        <button className="rounded border px-3 py-1 text-sm" onClick={save}>Save</button>
      </div>

      <div className="grid grid-cols-12 gap-3">
        {tiles.map((tile, i) => (
          <div key={i} className="col-span-12 md:col-span-6 lg:col-span-4 space-y-2">
            <div className="rounded border p-3 space-y-2 bg-white/70 dark:bg-white/[0.04]">
              <label className="block text-xs">Image</label>
              <select className="w-full rounded border px-2 py-1 text-sm" value={tile.src} onChange={(e) => updateTile(i, { src: e.target.value })}>
                <option value="">Select a file…</option>
                {files.map((f) => (
                  <option key={f} value={`/photos/${genre}/${f}`}>{f}</option>
                ))}
              </select>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs">Cols (1-12)</label>
                  <input type="number" min={1} max={12} className="w-full rounded border px-2 py-1 text-sm" value={tile.w} onChange={(e) => updateTile(i, { w: Number(e.target.value) })} />
                </div>
                <div className="flex-1">
                  <label className="block text-xs">Rows (1-40)</label>
                  <input type="number" min={1} max={40} className="w-full rounded border px-2 py-1 text-sm" value={tile.h} onChange={(e) => updateTile(i, { h: Number(e.target.value) })} />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs">Column start (optional)</label>
                  <input type="number" min={1} max={12} className="w-full rounded border px-2 py-1 text-sm" value={tile.c ?? 0} onChange={(e) => updateTile(i, { c: Number(e.target.value) || undefined })} />
                </div>
                <div className="flex-1">
                  <label className="block text-xs">Row start (optional)</label>
                  <input type="number" min={1} max={100} className="w-full rounded border px-2 py-1 text-sm" value={tile.r ?? 0} onChange={(e) => updateTile(i, { r: Number(e.target.value) || undefined })} />
                </div>
              </div>
              <div className="flex justify-end">
                <button className="text-red-600 text-sm" onClick={() => removeTile(i)}>Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-sm font-medium mb-2">Preview</h2>
        <div className="relative min-h-[40vh] border rounded">
          {tiles.map((tile, i) => (
            <div key={i} className="absolute bg-white/90" style={{ left: (tile.c ?? 0) * 40, top: (tile.r ?? 0) * 40, width: (tile.w ?? 8) * 40, height: (tile.h ?? 8) * 40 }}>
              <img src={tile.src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


