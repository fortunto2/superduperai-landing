'use client';
import React, { useEffect, useState } from 'react';

interface Entry { rank: number; name: string; score: number; }

export default function LiveLeaderboard() {
  const [data, setData] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const url = 'https://artificialanalysis.ai/api/text-to-video/arena/preferences/retrieve?user_key=total&supports_image_input=false';

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        // Преобразуем json в список Entry
        const entries: Entry[] = Object.entries(json.leaderboard || json).map(
          ([key, val]: any, idx) => ({ rank: idx + 1, name: key, score: val.score || Number(val) })
        );
        setData(entries.slice(0, 10));
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    const iv = setInterval(fetchData, 300_000);
    return () => clearInterval(iv);
  }, []);

  if (loading) return <div>Loading leaderboard...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <table className="table-auto w-full text-left border-collapse border border-slate-600">
      <thead>
        <tr>
          <th className="border border-slate-700 px-2 py-1">Rank</th>
          <th className="border border-slate-700 px-2 py-1">Model</th>
          <th className="border border-slate-700 px-2 py-1">Score</th>
        </tr>
      </thead>
      <tbody>
        {data.map(({ rank, name, score }) => (
          <tr key={name} className="hover:bg-slate-800">
            <td className="border border-slate-700 px-2 py-1">{rank}</td>
            <td className="border border-slate-700 px-2 py-1">{name}</td>
            <td className="border border-slate-700 px-2 py-1">{score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
