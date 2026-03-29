import { getLatestGames, getAllGames } from "@/lib/games";
import GameCard from "@/components/GameCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FreeGameZone - Play Free Online Games",
  description: "Play hundreds of free online games. Action, puzzle, racing, and more — new games added daily!",
};

const CATEGORIES = [
  { name: "Action", emoji: "⚔️", tag: "action" },
  { name: "Puzzle", emoji: "🧩", tag: "puzzle" },
  { name: "Racing", emoji: "🏎️", tag: "racing" },
  { name: "Shooting", emoji: "🔫", tag: "shooting" },
  { name: "Multiplayer", emoji: "👥", tag: "multiplayer" },
  { name: "Casual", emoji: "🎲", tag: "casual" },
  { name: "Adventure", emoji: "🗺️", tag: "adventure" },
  { name: "Runner", emoji: "🏃", tag: "runner" },
];

export default function HomePage() {
  const latestGames = getLatestGames(12);
  const allGames = getAllGames();

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center py-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Play Free Online Games 🎮
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Hundreds of free browser games — no download, no login. Just play!
          New games added every day.
        </p>
        <div className="mt-4 text-sm text-gray-500">
          {allGames.length}+ games available
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Browse by Category</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {CATEGORIES.map((cat) => (
            <a
              key={cat.tag}
              href={`/category/${cat.tag}`}
              className="bg-gray-800 hover:bg-purple-900 rounded-xl p-3 text-center transition group"
            >
              <div className="text-2xl mb-1">{cat.emoji}</div>
              <div className="text-xs text-gray-300 group-hover:text-white">{cat.name}</div>
            </a>
          ))}
        </div>
      </section>

      {/* Latest Games */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">🆕 New Games</h2>
          <a href="/new" className="text-purple-400 hover:text-purple-300 text-sm transition">
            View all →
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {latestGames.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      </section>

      {/* All Games */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">🎯 All Games</h2>
          <a href="/games" className="text-purple-400 hover:text-purple-300 text-sm transition">
            View all →
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {getAllGames().slice(0, 12).map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      </section>
    </div>
  );
}
