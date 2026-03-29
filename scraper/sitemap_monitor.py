#!/usr/bin/env python3
"""
Game Aggregator - Sitemap Monitor
每天爬取头部游戏站 sitemap，对比昨天，发现新游戏并通过飞书通知
"""

import os
import json
import time
import requests
import xml.etree.ElementTree as ET
from datetime import datetime, date
from pathlib import Path

# ============================================================
# 配置
# ============================================================

DATA_DIR = Path(__file__).parent.parent / "data"
DATA_DIR.mkdir(exist_ok=True)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

# 目标站点配置
SITES = [
    {
        "name": "Poki",
        "sitemap_url": "https://poki.com/en/sitemaps/games.xml",
        "game_url_prefix": "https://poki.com/en/g/",
        "type": "sitemap",
    },
    {
        "name": "CrazyGames",
        "sitemap_url": "https://www.crazygames.com/sitemap",
        "game_url_prefix": "https://www.crazygames.com/game/",
        "type": "sitemap",
    },
    {
        "name": "Silvergames",
        "scrape_url": "https://www.silvergames.com/en/new",
        "base_url": "https://www.silvergames.com",
        "game_url_prefix": "https://www.silvergames.com/en/",
        "type": "scrape",
        # 排除的非游戏路径
        "exclude_paths": {"/en/new", "/en/popular", "/en/action", "/en/racing",
                          "/en/shooting", "/en/sports", "/en/strategy", "/en/puzzle",
                          "/en/iogames", "/en/my"},
    },
]

# 飞书 Webhook（从环境变量读取）
FEISHU_WEBHOOK = os.environ.get("FEISHU_WEBHOOK", "")


# ============================================================
# 核心功能
# ============================================================

def fetch_sitemap(url: str) -> list[dict]:
    """爬取 sitemap，返回 [{url, lastmod}] 列表"""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=30)
        resp.raise_for_status()
        root = ET.fromstring(resp.text)
        ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        urls = []
        for url_elem in root.findall("sm:url", ns):
            loc = url_elem.find("sm:loc", ns)
            lastmod = url_elem.find("sm:lastmod", ns)
            if loc is not None:
                urls.append({
                    "url": loc.text.strip(),
                    "lastmod": lastmod.text.strip() if lastmod is not None else None,
                })
        return urls
    except Exception as e:
        print(f"[ERROR] 爬取 {url} 失败: {e}")
        return []


def extract_game_slug(url: str, prefix: str) -> str:
    """从 URL 提取游戏 slug"""
    if url.startswith(prefix):
        slug = url[len(prefix):].rstrip("/")
        return slug
    return url


def fetch_silvergames(site: dict) -> list[str]:
    """爬取 Silvergames 新游戏页，提取游戏 URL"""
    import re
    try:
        resp = requests.get(site["scrape_url"], headers=HEADERS, timeout=30)
        resp.raise_for_status()
        links = re.findall(r'href="(/en/[^"]+)"', resp.text)
        exclude = site.get("exclude_paths", set())
        game_urls = []
        seen = set()
        for path in links:
            # 只保留像游戏页的路径（/en/xxx 且不在排除列表里，不含子路径分隔）
            if path in exclude:
                continue
            if path.count("/") != 2:  # /en/game-name 只有2个斜杠
                continue
            full_url = site["base_url"] + path
            if full_url not in seen:
                seen.add(full_url)
                game_urls.append(full_url)
        return game_urls
    except Exception as e:
        print(f"[ERROR] 爬取 Silvergames 失败: {e}")
        return []


def is_game_url(url: str, site: dict) -> bool:
    """判断是否是游戏 URL"""
    return url.startswith(site["game_url_prefix"])


def load_previous(site_name: str) -> set[str]:
    """加载上次保存的游戏 URL 集合"""
    filepath = DATA_DIR / f"{site_name.lower()}_urls.json"
    if filepath.exists():
        with open(filepath) as f:
            data = json.load(f)
            return set(data.get("urls", []))
    return set()


def save_current(site_name: str, urls: list[str]):
    """保存当前游戏 URL 集合"""
    filepath = DATA_DIR / f"{site_name.lower()}_urls.json"
    with open(filepath, "w") as f:
        json.dump({
            "urls": list(urls),
            "updated_at": datetime.now().isoformat(),
        }, f, ensure_ascii=False, indent=2)


def notify_feishu(new_games: dict[str, list[str]]):
    """发送飞书通知"""
    if not FEISHU_WEBHOOK:
        print("[WARN] 未配置 FEISHU_WEBHOOK，跳过通知")
        return

    today = date.today().strftime("%Y-%m-%d")
    total = sum(len(v) for v in new_games.values())

    if total == 0:
        text = f"🎮 {today} 今日无新游戏上线"
    else:
        lines = [f"🎮 **{today} 新游戏监控报告** — 共 {total} 款新游戏\n"]
        for site_name, games in new_games.items():
            if games:
                lines.append(f"**{site_name}** ({len(games)} 款)")
                for g in games[:20]:  # 最多显示20条
                    lines.append(f"  • {g}")
                if len(games) > 20:
                    lines.append(f"  ... 还有 {len(games)-20} 款")
                lines.append("")
        text = "\n".join(lines)

    payload = {
        "msg_type": "text",
        "content": {"text": text}
    }
    try:
        resp = requests.post(FEISHU_WEBHOOK, json=payload, timeout=10)
        print(f"[INFO] 飞书通知已发送: {resp.status_code}")
    except Exception as e:
        print(f"[ERROR] 飞书通知失败: {e}")


def save_new_games_log(new_games: dict[str, list[str]]):
    """保存新游戏日志到文件"""
    today = date.today().strftime("%Y-%m-%d")
    log_path = DATA_DIR / f"new_games_{today}.json"
    with open(log_path, "w") as f:
        json.dump({
            "date": today,
            "new_games": new_games,
            "total": sum(len(v) for v in new_games.values()),
        }, f, ensure_ascii=False, indent=2)
    print(f"[INFO] 日志已保存到 {log_path}")


# ============================================================
# 主流程
# ============================================================

def run():
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] 开始爬取 sitemap...")
    new_games = {}

    for site in SITES:
        print(f"\n[INFO] 处理 {site['name']}...")

        if site.get("type") == "scrape":
            # 爬取型（Silvergames）
            game_urls = fetch_silvergames(site)
        else:
            # Sitemap 型（Poki / CrazyGames）
            all_urls = fetch_sitemap(site["sitemap_url"])
            game_urls = [
                item["url"] for item in all_urls
                if is_game_url(item["url"], site)
            ]
        print(f"[INFO] {site['name']}: 共 {len(game_urls)} 个游戏 URL")

        # 对比上次
        previous_urls = load_previous(site["name"])
        current_urls = set(game_urls)
        new_url_set = current_urls - previous_urls

        if previous_urls:
            print(f"[INFO] {site['name']}: 新增 {len(new_url_set)} 个游戏")
        else:
            print(f"[INFO] {site['name']}: 首次运行，保存基准数据（不计入新增）")
            new_url_set = set()  # 首次运行不算新增

        # 保存当前状态
        save_current(site["name"], current_urls)

        # 提取 slug 用于展示
        new_game_slugs = [
            extract_game_slug(u, site["game_url_prefix"])
            for u in sorted(new_url_set)
        ]
        new_games[site["name"]] = new_game_slugs

        time.sleep(2)  # 礼貌性延迟

    # 发通知 & 保存日志
    save_new_games_log(new_games)
    notify_feishu(new_games)

    total = sum(len(v) for v in new_games.values())
    print(f"\n✅ 完成！共发现 {total} 款新游戏")


if __name__ == "__main__":
    run()
