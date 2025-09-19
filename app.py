import feedparser
from flask import Flask, jsonify, render_template, Response, request
import html
import re
import time
from urllib.parse import urlparse
import threading
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)

# This is the list of verified, working RSS feeds.
rss_feeds = [
    "https://www.mintpressnews.com/feed/",
    "https://www.aljazeera.com/where/palestine/rss.xml",
    "https://blog.playstation.com/feed",
    "https://aiartblog.com/feed",
    "http://bristolpost.co.uk/whats-on/?service=rss",
    "https://www.somersetlive.co.uk/?service=rss",
    "https://netpol.org/feed/",
    "https://www.fujairahobserver.com/feed",
    "https://www.catalannews.com/rss/news/all",
    "https://www.hsj.co.uk/rss/latest-news/more",
    "https://www.england.nhs.uk/news/feed/",
    "https://blog.google/technology/ai/feed/",
    "https://www.wired.com/feed/tag/ai/latest/rss",
    "https://www.theregister.com/headlines.atom",
    "https://marvelsnapzone.com/feed/",
    "https://www.palestinechronicle.com/feed/",
    "https://www.declassifieduk.org/feed/",
    "https://www.bristol247.com/feed/",
    "https://www.middleeasteye.net/rss",
    "https://electronicintifada.net/rss",
    "https://www.thenation.com/feed/",
    "https://www.wsws.org/en/rss.xml",
    "https://socialistworker.org/rss/news.xml",
    "https://communistparty.org.uk/feed/podcast",
    "https://cosmonaut.blog/feed/",
    "https://palestinedeepdive.podbean.com/feed/",
    "https://feeds.simplecast.com/6_2n5uEa",
    "https://feeds.acast.com/public/shows/politicsjoe",
    "https://qudsn.co/feed/",
    "https://www.fullstackpython.com/feeds/AllFeeds.rss",
    "https://dnd.wizards.com/articles/rss.xml",
    "https://www.gamespot.com/feeds/news/tags/rockstar-games",
    "https://www.outside-xbox.com/feed/",
    "https://feeds.acast.com/public/shows/corridordigital",
    "https://www.wired.com/feed/rss",
    "https://www.youtube.com/feeds/videos.xml?channel_id=UCWJ2lWNubArHWmf3FIHnIFQ",
    "https://feeds.simplecast.com/2Yc6kM_P",
    "https://www.diffordsguide.com/rss/cocktails",
    "https://www.universetoday.com/feed/",
    "https://www.carbonbrief.org/feed/",
    "https://mindbodygreen.com/rss",
    "https://www.patheos.com/blogs/secularoutpost/feed/",
]

# A dictionary mapping outlet names to color classes.
source_colors = {
    "MintPress News": "color-1",
    "Al Jazeera English": "color-2",
    "PlayStation.Blog": "color-3",
    "AI Art Blog": "color-4",
    "Bristol Post": "color-5",
    "SomersetLive": "color-6",
    "Netpol": "color-7",
    "Fujairah Observer": "color-8",
    "Catalan News": "color-9",
    "Health Service Journal": "color-10",
    "NHS England": "color-1",
    "The Keyword": "color-2",
    "Wired": "color-3",
    "The Register": "color-4",
    "Marvel Snap Zone": "color-5",
    "Palestine Chronicle": "color-6",
    "Declassified UK": "color-7",
    "Bristol247": "color-8",
    "Middle East Eye": "color-9",
    "Electronic Intifada": "color-10",
    "The Nation": "color-1",
    "World Socialist Web Site": "color-2",
    "SocialistWorker.org": "color-3",
    "The Communist": "color-4",
    "Cosmonaut Magazine": "color-5",
    "Palestine Deep Dive": "color-6",
    "TRT World": "color-7",
    "PoliticsJOE": "color-8",
    "Quds News Network": "color-9",
    "Full Stack Python": "color-10",
    "D&D Official": "color-1",
    "Gamespot": "color-2",
    "Outside Xbox": "color-3",
    "Corridor Crew": "color-4",
    "Linus Tech Tips": "color-5",
    "ASMR": "color-6",
    "Difford's Guide": "color-7",
    "Universe Today": "color-8",
    "Carbon Brief": "color-9",
    "MindBodyGreen": "color-10",
    "Secular Outpost": "color-1",
}

# Cache for headlines and status
cached_headlines = []
feed_status = {}
last_refresh = None
CACHE_DURATION = 600  # 10 minutes

# Map of feed URLs to clean names
source_map = {
    "https://www.fujairahobserver.com/feed": "Fujairah Observer",
    "https://www.hsj.co.uk/rss/latest-news/more": "Health Service Journal",
    "https://electronicintifada.net/rss": "Electronic Intifada",
    "https://www.thenation.com/feed/": "The Nation",
    "https://www.wsws.org/en/rss.xml": "World Socialist Web Site",
    "https://socialistworker.org/rss/news.xml": "SocialistWorker.org",
    "https://communistparty.org.uk/feed/podcast": "The Communist",
    "https://cosmonaut.blog/feed/": "Cosmonaut Magazine",
    "https://palestinedeepdive.podbean.com/feed/": "Palestine Deep Dive",
    "https://feeds.simplecast.com/6_2n5uEa": "TRT World",
    "https://feeds.acast.com/public/shows/politicsjoe": "PoliticsJOE",
    "https://qudsn.co/feed/": "Quds News Network",
    "https://www.fullstackpython.com/feeds/AllFeeds.rss": "Full Stack Python",
    "https://dnd.wizards.com/articles/rss.xml": "D&D Official",
    "https://www.gamespot.com/feeds/news/tags/rockstar-games": "Gamespot",
    "https://www.outside-xbox.com/feed/": "Outside Xbox",
    "https://feeds.acast.com/public/shows/corridordigital": "Corridor Crew",
    "https://www.wired.com/feed/rss": "Wired",
    "https://www.youtube.com/feeds/videos.xml?channel_id=UCWJ2lWNubArHWmf3FIHnIFQ": "Linus Tech Tips",
    "https://feeds.simplecast.com/2Yc6kM_P": "ASMR",
    "https://www.diffordsguide.com/rss/cocktails": "Difford's Guide",
    "https://www.universetoday.com/feed/": "Universe Today",
    "https://www.carbonbrief.org/feed/": "Carbon Brief",
    "https://mindbodygreen.com/rss": "MindBodyGreen",
    "https://www.patheos.com/blogs/secularoutpost/feed/": "Secular Outpost",
}

def fetch_single_feed(url):
    """Fetch a single feed and return its articles."""
    articles = []
    try:
        feed = feedparser.parse(url)
        if not feed.entries:
            logging.warning(f"No entries found for {url}")
            feed_status[url] = {"status": "empty", "count": 0}
            return []

        outlet_name = source_map.get(url, feed.feed.get('title', 'Unknown Outlet'))
        if not outlet_name:
            outlet_name = urlparse(url).netloc.replace('www.', '')

        color_class = source_colors.get(outlet_name, "default-color")

        for entry in feed.entries:
            clean_summary = html.unescape(entry.get('summary', 'No summary available.'))
            clean_summary = re.sub('<.*?>', '', clean_summary)

            MAX_SUMMARY_LENGTH = 250
            if len(clean_summary) > MAX_SUMMARY_LENGTH:
                clean_summary = clean_summary[:MAX_SUMMARY_LENGTH] + "..."

            if hasattr(entry, 'published_parsed'):
                published_date = time.strftime('%B %d, %Y - %I:%M %p', entry.published_parsed)
                article = {
                    'outlet': outlet_name,
                    'title': entry.title,
                    'summary': clean_summary,
                    'link': entry.link,
                    'published': entry.published_parsed,
                    'published_formatted': published_date,
                    'color': color_class,
                }
                articles.append(article)

        feed_status[url] = {"status": "ok", "count": len(articles)}
    except Exception as e:
        logging.error(f"Error fetching {url}: {e}")
        feed_status[url] = {"status": "error", "error": str(e), "count": 0}
        return []
    return articles

def fetch_headlines_parallel():
    """Fetch all feeds in parallel and normalize the headlines."""
    articles_by_source = {}

    with ThreadPoolExecutor(max_workers=10) as executor:
        future_to_url = {executor.submit(fetch_single_feed, url): url for url in rss_feeds}
        for future in as_completed(future_to_url, timeout=20):
            url = future_to_url[future]
            try:
                articles = future.result(timeout=5)
                if not articles:
                    continue
                outlet_name = articles[0]['outlet']
                articles_by_source.setdefault(outlet_name, []).extend(articles)
            except Exception as e:
                logging.warning(f"Timeout or error fetching {url}: {e}")
                feed_status[url] = {"status": "timeout", "error": str(e), "count": 0}
                continue

    # Sort and normalize
    for source in articles_by_source:
        articles_by_source[source].sort(key=lambda x: x['published'], reverse=True)

    normalized_headlines = []
    max_per_feed = 5
    for i in range(max_per_feed):
        for source in articles_by_source:
            if i < len(articles_by_source[source]):
                normalized_headlines.append(articles_by_source[source][i])

    return normalized_headlines

def update_cache():
    """Background task to refresh headlines every CACHE_DURATION seconds."""
    global cached_headlines, last_refresh
    while True:
        try:
            logging.info("Refreshing feed cache...")
            cached_headlines = fetch_headlines_parallel()
            last_refresh = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime())
            logging.info(f"Cache updated with {len(cached_headlines)} articles")
        except Exception as e:
            logging.error(f"Cache update failed: {e}")
        time.sleep(CACHE_DURATION)

# Create a Flask web application instance
app = Flask(__name__)

@app.route("/headlines")
def headlines_json():
    return jsonify(cached_headlines)

@app.route("/status")
def status():
    """Return feed health in colour-coded HTML table (or JSON if requested)."""
    if request.headers.get("Accept") == "application/json":
        return jsonify({"last_refresh": last_refresh, "feeds": feed_status})

    # Build HTML table with colour coding
    rows = ""
    for url, info in feed_status.items():
        status = info.get("status", "unknown")
        count = info.get("count", 0)
        error = info.get("error", "")

        if status == "ok":
            color = "style='background-color:#d4edda; color:#155724;'"  # green
        elif status == "empty":
            color = "style='background-color:#fff3cd; color:#856404;'"  # yellow
        elif status == "timeout":
            color = "style='background-color:#ffeeba; color:#856404;'"  # orange
        elif status == "error":
            color = "style='background-color:#f8d7da; color:#721c24;'"  # red
        else:
            color = ""

        rows += f"<tr><td>{url}</td><td {color}>{status}</td><td>{count}</td><td>{error}</td></tr>"

    html_table = f"""
    <html>
    <head>
        <title>Feed Status</title>
        <style>
            body {{ font-family: Arial, sans-serif; }}
            table {{ border-collapse: collapse; width: 100%; }}
            th, td {{ border: 1px solid #ddd; padding: 8px; }}
            th {{ background-color: #f2f2f2; }}
        </style>
    </head>
    <body>
        <h2>Feed Status</h2>
        <p>Last refresh: {last_refresh}</p>
        <table>
            <tr><th>Feed URL</th><th>Status</th><th>Articles</th><th>Error</th></tr>
            {rows}
        </table>
    </body>
    </html>
    """
    return Response(html_table, mimetype="text/html")

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    # Start background thread
    updater = threading.Thread(target=update_cache, daemon=True)
    updater.start()

    # Run Flask
    app.run(debug=True)
