import feedparser
from flask import Flask, jsonify, render_template
import html
import re
from urllib.parse import urlparse

# This is the list of verified, working RSS feeds.
rss_feeds = [
    "https://www.mintpressnews.com/feed/",
    "https://www.aljazeera.com/where/palestine/rss.xml",
    "https://blog.playstation.com/feed",
    "https://aiartblog.com/feed",
    "https://www.bristolpost.co.uk/?service=rss",
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
    Returns a list of dictionaries with 'title', 'summary', 'link', and 'outlet'.
    """
    all_headlines = []

    for url in rss_feeds:
        try:
            feed = feedparser.parse(url)
            if not feed.entries:
                continue

            # Get a clean outlet name
            outlet_name = feed.feed.get('title', 'Unknown Outlet')
            if not outlet_name:
                # Fallback to the domain name if the title is empty
                outlet_name = urlparse(url).netloc.replace('www.', '')

            for entry in feed.entries:
                clean_summary = html.unescape(entry.get('summary', 'No summary available.'))
                clean_summary = re.sub('<.*?>', '', clean_summary)
                
                # Check if 'published_parsed' exists before appending to avoid errors
                if hasattr(entry, 'published_parsed'):
                    all_headlines.append({
                        'outlet': outlet_name,
                        'title': entry.title,
                        'summary': clean_summary,
                        'link': entry.link,
                        'published': entry.published_parsed  # Add the publication date
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
