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

def get_source_from_url(url):
    """
    Extracts a user-friendly source name from a URL.
    """
    try:
        if "thenation.com" in url:
            return "The Nation"
        elif "wsws.org" in url:
            return "WSWS"
        elif "socialistworker.org" in url:
            return "SocialistWorker"
        elif "communistparty.org.uk" in url:
            return "The Communist"
        elif "cosmonaut.blog" in url:
            return "Cosmonaut Magazine"
        elif "palestinedeepdive.podbean.com" in url:
            return "Palestine Deep Dive"
        elif "trtworld.com" in url:
            return "TRT World"
        elif "politicsjoe" in url:
            return "PoliticsJOE"
        elif "qudsn.co" in url:
            return "QNN"
        elif "fullstackpython.com" in url:
            return "Python Feeds"
        elif "dnd.wizards.com" in url:
            return "Dungeons & Dragons"
        elif "gamespot.com" in url and "rockstar-games" in url:
            return "Rockstar"
        elif "outside-xbox.com" in url:
            return "Outside Xbox"
        elif "corridordigital.com" in url:
            return "Corridor Crew"
        elif "wired.com" in url:
            return "Wired"
        elif "linustechtips.com" in url or "youtube.com" in url and "UCWJ2lWNubArHWmf3FIHnIFQ" in url:
            return "Linus Tech Tips"
        elif "simplecast.com" in url and "2Yc6kM_P" in url:
            return "ASMR"
        elif "diffordsguide.com" in url:
            return "Mixology"
        elif "universetoday.com" in url:
            return "Cosmology"
        elif "carbonbrief.org" in url:
            return "Climate Change"
        elif "mindbodygreen.com" in url:
            return "Health and Wellness"
        elif "patheos.com" in url and "secularoutpost" in url:
            return "Atheism"
        else:
            domain = urlparse(url).netloc
            domain = domain.replace('www.', '')
            domain = domain.split('.')[0]
            return domain.capitalize()
    except Exception:
        return "Unknown"

# Define a function to fetch headlines from RSS feeds
def get_headlines():
    articles_by_source = {}
    
    # Define color classes for each outlet to make them visually distinct
    outlet_colors = {
        "The Nation": "is-info",
        "WSWS": "is-danger",
        "SocialistWorker": "is-warning",
        "The Communist": "is-dark",
        "Cosmonaut Magazine": "is-primary",
        "Palestine Deep Dive": "is-link",
        "TRT World": "is-info",
        "PoliticsJOE": "is-success",
        "QNN": "is-danger",
        "Python Feeds": "is-warning",
        "Dungeons & Dragons": "is-dark",
        "Rockstar": "is-primary",
        "Outside Xbox": "is-link",
        "Corridor Crew": "is-info",
        "Wired": "is-success",
        "Linus Tech Tips": "is-danger",
        "ASMR": "is-warning",
        "Mixology": "is-dark",
        "Cosmology": "is-primary",
        "Climate Change": "is-link",
        "Health and Wellness": "is-info",
        "Atheism": "is-success",
    }

    for url in rss_feeds:
        try:
            feed = feedparser.parse(url)
            outlet_name = get_source_from_url(url)
            color_class = outlet_colors.get(outlet_name, "is-primary")
            for entry in feed.entries:
                # Clean up the title and summary
                title = html.unescape(entry.get('title', 'No Title')).strip()
                summary = html.unescape(entry.get('summary', 'No Summary')).strip()
                
                # Check if the title is a URL and a more descriptive title is available
                if re.match(r'https?://\S+', title):
                    # Check for a better title in summary or entry details
                    if 'media_content' in entry and entry['media_content']:
                        title = entry['media_content'][0].get('title', title)
                    elif 'link' in entry:
                        # Fallback to a part of the URL if no title is found, but this is less than ideal
                        title = urlparse(entry['link']).path.strip('/').replace('/', ' - ').replace('-', ' ').title()

                # Get the link
                link = entry.get('link', '#')

                # Get the publication date, with fallback
                published_date_str = entry.get('published', entry.get('updated', ''))
                try:
                    published_parsed = entry.get('published_parsed', entry.get('updated_parsed'))
                    if published_parsed:
                        published_date = time.mktime(published_parsed)
                        published_date_formatted = time.strftime('%b %d, %Y', published_parsed)
                    else:
                        published_date = 0
                        published_date_formatted = "Date Unknown"
                except (ValueError, TypeError):
                    published_date = 0
                    published_date_formatted = "Date Unknown"

                # Create the article dictionary
                article = {
                    'title': title,
                    'summary': summary,
                    'link': link,
                    'source': outlet_name,
                    'published': published_date,
                    'published_formatted': published_date_formatted,
                    'color': color_class,
                }

                if outlet_name not in articles_by_source:
                    articles_by_source[outlet_name] = []
                articles_by_source[outlet_name].append(article)
        except Exception as e:
            print(f"Error fetching {url}: {e}")

    # Sort articles within each source group by date, from newest to oldest
    for source in articles_by_source:
        articles_by_source[source].sort(key=lambda x: x['published'], reverse=True)

    # --- NEW NORMALIZATION LOGIC ---
    normalized_headlines = []
    max_per_feed = 5  # Set the maximum number of articles per feed

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
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)