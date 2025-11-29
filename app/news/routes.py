import feedparser
from flask import Blueprint, jsonify, render_template, url_for
import html
import re
import time
from urllib.parse import urlparse

news = Blueprint('news', __name__, template_folder='templates', static_folder='static')

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
# You can customize these colors.
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


def get_headlines():
    """
    Fetches headlines, summaries, links, outlet, and color from the list of RSS feeds.
    
    This function now normalizes the feeds to ensure a balanced display of articles.
    """
    articles_by_source = {}

    for url in rss_feeds:
        try:
            feed = feedparser.parse(url)
            if not feed.entries:
                continue

            outlet_name = feed.feed.get('title', 'Unknown Outlet')
            if not outlet_name:
                outlet_name = urlparse(url).netloc.replace('www.', '')

            if url == "https://www.middleeasteye.net/rss":
                outlet_name = "Middle East Eye"
            
            # Use a dictionary to map feed URLs to consistent source names
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
            # Look up the outlet name using the URL map, falling back to the feed's title
            outlet_name = source_map.get(url, outlet_name)


            # Get the color class from the dictionary, defaulting to 'default-color'
            color_class = source_colors.get(outlet_name, "default-color")

            for entry in feed.entries:
                clean_summary = html.unescape(entry.get('summary', 'No summary available.'))
                clean_summary = re.sub('<.*?>', '', clean_summary)

                # Trim summary if it's too long
                MAX_SUMMARY_LENGTH = 250
                if len(clean_summary) > MAX_SUMMARY_LENGTH:
                    clean_summary = clean_summary[:MAX_SUMMARY_LENGTH] + "..."
                
                # Check if 'published_parsed' exists before appending to avoid errors
                if hasattr(entry, 'published_parsed'):
                    published_date = time.strftime('%B %d, %Y - %I:%M %p', entry.published_parsed)
                    article = {
                        'outlet': outlet_name,
                        'title': entry.title,
                        'summary': clean_summary,
                        'link': entry.link,
                        'published': entry.published_parsed,  # Used for sorting
                        'published_formatted': published_date, # Used for display
                        'color': color_class,  # Add the color class
                    }
                    if outlet_name not in articles_by_source:
                        articles_by_source[outlet_name] = []
                    articles_by_source[outlet_name].append(article)
        except Exception:
            pass
            
    # Sort articles within each source group by date, from newest to oldest
    for source in articles_by_source:
        articles_by_source[source].sort(key=lambda x: x['published'], reverse=True)

    # --- NEW NORMALIZATION LOGIC ---
    normalized_headlines = []
    max_per_feed = 5 # Set the maximum number of articles per feed

    # Interleave the articles from each source
    for i in range(max_per_feed):
        for source in articles_by_source:
            if i < len(articles_by_source[source]):
                normalized_headlines.append(articles_by_source[source][i])
    
    return normalized_headlines
    # --- END NEW LOGIC ---

# Define a route to fetch and return the headlines as JSON
@news.route("/headlines")
def headlines_json():
    headlines = get_headlines()
    return jsonify(headlines)

# Define a route to serve the HTML page
@news.route("/")
def index():
    return render_template("news.html")
