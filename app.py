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
    "http://bristolpost.co.uk/whats-on/?service=rss", # NEW BRISTOL WHAT'S ON FEED
    "https://www.somersetlive.co.uk/?service=rss",
    "https://netpol.org/feed/",
    "https://www.fujairahobserver.com/category/news/local-news/",
    "https://www.catalannews.com/rss/news/all",
    "https://www.hsj.co.uk/latest-news/20683.more",
    "https://www.england.nhs.uk/news/feed/",
    "https://blog.google/technology/ai/feed/",
    "https://www.wired.com/feed/tag/ai/latest/rss",
    "https://www.theregister.com/headlines.atom",
    "https://marvelsnapzone.com/feed/",
    "https://www.palestinechronicle.com/feed/",
    "https://www.declassifieduk.org/feed/",
    "https://www.bristol247.com/feed/",
    "https://www.middleeasteye.net/rss",
    "https://www.counterfire.org/feed/"
]

def get_headlines():
    """
    Fetches headlines, summaries, links, and outlet from the list of RSS feeds.
    Returns a list of dictionaries with 'title', 'summary', 'link', 'outlet',
    'published_formatted', and optionally 'image_url'.
    """
    all_headlines = []

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

            for entry in feed.entries:
                clean_summary = html.unescape(entry.get('summary', 'No summary available.'))
                clean_summary = re.sub('<.*?>', '', clean_summary)

                image_url = None
                if 'media_content' in entry and len(entry.media_content) > 0:
                    image_url = entry.media_content[0].get('url')
                elif 'enclosures' in entry and len(entry.enclosures) > 0:
                    if entry.enclosures[0].get('type', '').startswith('image/'):
                        image_url = entry.enclosures[0].get('href')
                
                # Check if 'published_parsed' exists before appending to avoid errors
                if hasattr(entry, 'published_parsed'):
                    published_date = time.strftime('%B %d, %Y - %I:%M %p', entry.published_parsed)
                    all_headlines.append({
                        'outlet': outlet_name,
                        'title': entry.title,
                        'summary': clean_summary,
                        'link': entry.link,
                        'published': entry.published_parsed,  # Used for sorting
                        'published_formatted': published_date, # Used for display
                        'image_url': image_url
                    })
        except Exception:
            pass
            
    # Sort the headlines by date, from newest to oldest
    all_headlines.sort(key=lambda x: x['published'], reverse=True)
    return all_headlines

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