import feedparser
from flask import Flask, jsonify, render_template
import html
import re
import time
from urllib.parse import urlparse

# This is the list of verified, working RSS feeds.
rss_feeds = [
    "https://www.mintpressnews.com/feed/",
    "https://www.aljazeera.com/where/palestine/rss.xml",
    "https://blog.playstation.com/feed",
    "https://aiartblog.com/feed",
    "http://bristolpost.co.uk/whats-on/?service=rss",
    "https://www.somersetlive.co.uk/?service=rss",
    "https://netpol.org/feed/",
    "https://www.fujairahobserver.com/feed", # Corrected RSS feed URL
    "https://www.catalannews.com/rss/news/all",
    "https://www.hsj.co.uk/rss/latest-news/more", # Corrected RSS feed URL
    "https://www.england.nhs.uk/news/feed/",
    "https://blog.google/technology/ai/feed/",
    "https://www.wired.com/feed/tag/ai/latest/rss",
    "https://www.theregister.com/headlines.atom",
    "https://marvelsnapzone.com/feed/",
    "https://www.palestinechronicle.com/feed/",
    "https://www.declassifieduk.org/feed/",
    "https://www.bristol247.com/feed/",
    "https://www.middleeasteye.net/rss",
    "https://electronicintifada.net/rss"
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
    "NHS England": "color-1", # Reusing colors
    "The Keyword": "color-2", # Reusing colors
    "Wired": "color-3", # Reusing colors
    "The Register": "color-4", # Reusing colors
    "Marvel Snap Zone": "color-8", # Reusing colors
    "Palestine Chronicle": "color-6", # Reusing colors
    "Declassified UK": "color-7", # Reusing colors
    "Bristol247": "color-8", # Reusing colors
    "Middle East Eye": "color-9", # Reusing colors
    "Electronic Intifada": "color-10", # Corrected feed name
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

            # Specific fix for Middle East Eye's feed name
            if url == "https://www.middleeasteye.net/rss":
                outlet_name = "Middle East Eye"

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

# Create a Flask web application instance
app = Flask(__name__)

# Define a route to fetch and return the headlines as JSON
@app.route("/headlines")
def headlines_json():
    headlines = get_headlines()
    return jsonify(headlines)

# Define a route to serve the HTML page
@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)