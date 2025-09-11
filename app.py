import feedparser
from flask import Flask, jsonify, render_template
import html
import re

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
    Fetches headlines, summaries, and links from the list of RSS feeds.
    Returns a list of dictionaries with 'title', 'summary', and 'link'.
    """
    all_headlines = []

    for url in rss_feeds:
        try:
            feed = feedparser.parse(url)
            if not feed.entries:
                continue

            for entry in feed.entries:
                clean_summary = html.unescape(entry.get('summary', 'No summary available.'))
                clean_summary = re.sub('<.*?>', '', clean_summary)
                
                all_headlines.append({
                    'title': entry.title,
                    'summary': clean_summary,
                    'link': entry.link
                })
        except Exception:
            pass
            
    return all_headlines

# Create a Flask web application instance
app = Flask(__name__)

# Define a route to fetch and return the headlines as JSON
@app.route("/headlines")
def headlines_json():
    headlines = get_headlines()
    return jsonify(headlines)

# Define a route for the main page that will display the webpage
@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)