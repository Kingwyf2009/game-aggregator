import Link from "next/link";
import { Game } from "@/lib/games";

export default function GameCard({ game }: { game: Game }) {
  return (
    <Link href={`/game/${game.slug}`}>
      <div className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-700 hover:scale-105 transition-all duration-200 cursor-pointer group">
        {/* Thumbnail */}
        <div className="aspect-video bg-gray-700 overflow-hidden">
          {game.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={game.thumbnail}
              alt={game.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">🎮</div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="font-semibold text-white text-sm truncate">{game.title}</h3>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-400">{game.source}</span>
            {game.tags && game.tags[0] && (
              <span className="text-xs bg-purple-900 text-purple-300 px-2 py-0.5 rounded-full">
                {game.tags[0]}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
