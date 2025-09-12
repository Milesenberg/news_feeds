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
    "https://www.reddit.com/r/civitai/.rss" # NEW: Reddit RSS Feed
]

# A dictionary to hold a name and color for each feed URL
feed_info = {
    "https://www.mintpressnews.com/feed/": {"name": "MintPress News", "color": "red"},
    "https://www.aljazeera.com/where/palestine/rss.xml": {"name": "Al Jazeera", "color": "orange"},
    "https://blog.playstation.com/feed": {"name": "PlayStation Blog", "color": "blue"},
    "https://aiartblog.com/feed": {"name": "AI Art Blog", "color": "purple"},
    "http://bristolpost.co.uk/whats-on/?service=rss": {"name": "Bristol Post", "color": "blue"},
    "https://www.somersetlive.co.uk/?service=rss": {"name": "Somerset Live", "color": "green"},
    "https://netpol.org/feed/": {"name": "Netpol", "color": "yellow"},
    "https://www.fujairahobserver.com/category/news/local-news/": {"name": "Fujairah Observer", "color": "cyan"},
    "https://www.catalannews.com/rss/news/all": {"name": "Catalan News", "color": "magenta"},
    "https://www.hsj.co.uk/latest-news/20683.more": {"name": "HSJ", "color": "pink"},
    "https://www.england.nhs.uk/news/feed/": {"name": "NHS England", "color": "teal"},
    "https://blog.google/technology/ai/feed/": {"name": "Google AI Blog", "color": "brown"},
    "https://www.wired.com/feed/tag/ai/latest/rss": {"name": "Wired AI", "color": "coral"},
    "https://www.theregister.com/headlines.atom": {"name": "The Register", "color": "navy"},
    "https://marvelsnapzone.com/feed/": {"name": "Marvel Snap Zone", "color": "olive"},
    "https://www.palestinechronicle.com/feed/": {"name": "Palestine Chronicle", "color": "lime"},
    "https://www.declassifieduk.org/feed/": {"name": "Declassified UK", "color": "indigo"},
    "https://www.reddit.com/r/civitai/.rss": {"name": "r/civitai", "color": "red"} # NEW: Feed info for Reddit
}

def get_headlines():
    # ... (existing code)
    # The image-finding logic needs to be added here.
    # The provided code snippet already contains the structure for parsing, so the image logic goes inside the loop.
    
    # --- UPDATED get_headlines() FUNCTION ---
    headlines = []
    articles_by_source = {}
    
    for url in rss_feeds:
        try:
            feed = feedparser.parse(url)
            outlet_name = feed_info.get(url, {}).get("name", "Unknown")
            color_class = feed_info.get(url, {}).get("color", "default")
            
            for entry in feed.entries:
                # Get the link and title
                link = entry.link
                title = html.unescape(entry.title)
                
                # Extract the summary, handling different attributes
                summary_raw = ""
                if 'summary' in entry:
                    summary_raw = entry.summary
                elif 'description' in entry:
                    summary_raw = entry.description
                
                # Clean up summary by removing HTML tags
                summary = re.sub('<[^<]+?>', '', summary_raw)
                
                # Extract image URL
                image_url = ""
                # Check for media:content first (common for Reddit)
                if 'media_content' in entry and len(entry.media_content) > 0:
                    image_url = entry.media_content[0]['url']
                # If not found, try to extract from summary or content
                elif 'content' in entry and len(entry.content) > 0:
                    image_match = re.search(r'<img.*?src="(.*?)".*?>', entry.content[0]['value'])
                    if image_match:
                        image_url = image_match.group(1)
                
                # Get the published date
                published_date = ""
                if hasattr(entry, 'published_parsed'):
                    published_date = time.strftime('%Y-%m-%d %H:%M:%S', entry.published_parsed)

                article = {
                    'title': title,
                    'link': link,
                    'summary': summary,
                    'outlet': outlet_name,
                    'image': image_url, # NEW: Add the image URL
                    'published': entry.published_parsed, # Used for sorting
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