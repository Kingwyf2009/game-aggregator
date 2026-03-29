import { getAllGames, getGameBySlug } from "@/lib/games";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import GameCard from "@/components/GameCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const games = getAllGames();
  return games.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) return { title: "Game Not Found" };
  return {
    title: `Play ${game.title} - FreeGameZone`,
    description: game.description ?? `Play ${game.title} for free online!`,
  };
}

export default async function GamePage({ params }: Props) {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) notFound();

  const allGames = getAllGames();
  const related = allGames
    .filter((g) => g.slug !== game.slug && g.tags?.some((t) => game.tags?.includes(t)))
    .slice(0, 6);

  const iframeUrl = game.iframe_url ?? game.source_url;

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400">
        <a href="/" className="hover:text-white transition">Home</a>
        <span className="mx-2">/</span>
        <span className="text-white">{game.title}</span>
      </nav>

      {/* Game + Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Game iframe */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-gray-800 rounded-xl overflow-hidden aspect-video">
            <iframe
              src={iframeUrl}
              title={game.title}
              className="w-full h-full border-0"
              allowFullScreen
              allow="gamepad; autoplay; clipboard-write"
            />
          </div>
          {/* Fullscreen hint */}
          <p className="text-xs text-gray-500 text-center">
            Click inside the game to play · Press F11 for fullscreen
          </p>
        </div>

        {/* Game Info */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{game.title}</h1>

          {game.description && (
            <p className="text-gray-300 leading-relaxed">{game.description}</p>
          )}

          {/* Tags */}
          {game.tags && game.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {game.tags.map((tag) => (
                <a
                  key={tag}
                  href={`/category/${tag}`}
                  className="bg-purple-900 text-purple-300 hover:bg-purple-800 text-xs px-3 py-1 rounded-full transition"
                >
                  {tag}
                </a>
              ))}
            </div>
          )}

          {/* Meta */}
          <div className="bg-gray-800 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Source</span>
              <span className="text-white">{game.source}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Added</span>
              <span className="text-white">{game.added_date}</span>
            </div>
          </div>

          {/* Original link */}
          <a
            href={game.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-xs text-gray-500 hover:text-gray-300 transition"
          >
            View on {game.source} ↗
          </a>
        </div>
      </div>

      {/* Related Games */}
      {related.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {related.map((g) => (
              <GameCard key={g.slug} game={g} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
