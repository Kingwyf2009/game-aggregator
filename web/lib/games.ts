import fs from "fs";
import path from "path";

export interface Game {
  slug: string;
  title: string;
  source: string;
  source_url: string;
  iframe_url?: string;
  thumbnail?: string;
  description?: string;
  tags?: string[];
  added_date: string;
}

const DATA_FILE = path.join(process.cwd(), "../data/games.json");

export function getAllGames(): Game[] {
  if (!fs.existsSync(DATA_FILE)) return getSampleGames();
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw) as Game[];
}

export function getGameBySlug(slug: string): Game | undefined {
  return getAllGames().find((g) => g.slug === slug);
}

export function getLatestGames(limit = 20): Game[] {
  return [...getAllGames()]
    .sort((a, b) => b.added_date.localeCompare(a.added_date))
    .slice(0, limit);
}

export function getGamesByTag(tag: string): Game[] {
  return getAllGames().filter((g) => g.tags?.includes(tag));
}

// 样本数据（在真实数据就绪前展示）
function getSampleGames(): Game[] {
  return [
    {
      slug: "subway-surfers",
      title: "Subway Surfers",
      source: "Poki",
      source_url: "https://poki.com/en/g/subway-surfers",
      iframe_url: "https://poki.com/en/g/subway-surfers",
      thumbnail: "https://img.poki-cdn.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,f=auto/29e8af01fcad34be7ecfa94b5248f8ae.png",
      description: "Run, jump, and dodge trains in this endless runner!",
      tags: ["action", "runner"],
      added_date: "2026-03-29",
    },
    {
      slug: "2048",
      title: "2048",
      source: "CrazyGames",
      source_url: "https://www.crazygames.com/game/2048",
      iframe_url: "https://www.crazygames.com/embed/2048",
      thumbnail: "https://imgs.crazygames.com/2048_16x9/20240213080408/2048_16x9-cover?metadata=none",
      description: "Combine tiles to reach 2048 in this addictive puzzle game!",
      tags: ["puzzle", "casual"],
      added_date: "2026-03-29",
    },
    {
      slug: "1v1-lol",
      title: "1v1.LOL",
      source: "Poki",
      source_url: "https://poki.com/en/g/1v1-lol",
      iframe_url: "https://poki.com/en/g/1v1-lol",
      thumbnail: "https://img.poki-cdn.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,f=auto/1v1lol.png",
      description: "Build and battle in this fast-paced shooting game!",
      tags: ["action", "shooting", "multiplayer"],
      added_date: "2026-03-28",
    },
    {
      slug: "slope",
      title: "Slope",
      source: "CrazyGames",
      source_url: "https://www.crazygames.com/game/slope",
      iframe_url: "https://www.crazygames.com/embed/slope",
      thumbnail: "https://imgs.crazygames.com/slope/20230209135334/slope-cover?metadata=none",
      description: "Control a ball rolling down an endless slope — how far can you go?",
      tags: ["action", "casual"],
      added_date: "2026-03-28",
    },
    {
      slug: "minecraft-classic",
      title: "Minecraft Classic",
      source: "Poki",
      source_url: "https://poki.com/en/g/minecraft-classic",
      iframe_url: "https://poki.com/en/g/minecraft-classic",
      thumbnail: "https://img.poki-cdn.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,f=auto/minecraft.png",
      description: "Build anything you can imagine in the original Minecraft!",
      tags: ["adventure", "sandbox"],
      added_date: "2026-03-27",
    },
    {
      slug: "among-us",
      title: "Among Us Online",
      source: "CrazyGames",
      source_url: "https://www.crazygames.com/game/among-us-online",
      iframe_url: "https://www.crazygames.com/embed/among-us-online",
      thumbnail: "https://imgs.crazygames.com/among-us-online/20220722120000/among-us-online-cover?metadata=none",
      description: "Find the impostor before it's too late!",
      tags: ["multiplayer", "casual"],
      added_date: "2026-03-27",
    },
  ];
}
