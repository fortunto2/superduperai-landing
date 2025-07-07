import React, { useEffect, useState } from 'react';

const leaderboardUrl = 'https://artificialanalysis.ai/text-to-video/arena?tab=leaderboard';

function parseLeaderboardHTML(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const rows = Array.from(doc.querySelectorAll('table#leaderboard tbody tr'));
  const top10 = rows.slice(0, 10).map(row => {
    const cols = row.querySelectorAll('td');
    return {
      rank: cols[0]?.textContent.trim() || '',
      name: cols[1]?.textContent.trim() || '',
      score: cols[2]?.textContent.trim() || '',
    };
  });
  return top10;
}

export default function LiveLeaderboard() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch('/api/proxy-leaderboard');
        if (!res.ok) throw new Error('Failed to load leaderboard');
        const html = await res.text();
        const leaderboard = parseLeaderboardHTML(html);
        setData(leaderboard);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchLeaderboard();

    const interval = setInterval(fetchLeaderboard, 5 * 60 * 1000); // refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  if (error) return <p>Error loading leaderboard: {error}</p>;
  if (data.length === 0) return <p>Loading leaderboard...</p>;

  return (
    <table>
      <thead>
        <tr><th>Rank</th><th>Name</th><th>Score</th></tr>
      </thead>
      <tbody>
        {data.map(item => (
          <tr key={item.rank}>
            <td>{item.rank}</td>
            <td>{item.name}</td>
            <td>{item.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
