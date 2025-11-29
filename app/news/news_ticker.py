import feedparser
import tkinter as tk
import webbrowser
import html
import re

def get_headlines():
    """
    Fetches headlines, summaries, and links from a custom list of RSS feeds.
    Returns a list of dictionaries with 'title', 'summary', and 'link'.
    """
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

    all_headlines = []

    for url in rss_feeds:
        try:
            feed = feedparser.parse(url)
            if not feed.entries:
                continue

            for entry in feed.entries:
                # Decode and strip HTML tags from the summary
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

def on_link_click(url):
    """
    Opens the link in the web browser when a tagged text is clicked.
    """
    webbrowser.open_new(url)

def update_gui():
    """
    Fetches the headlines and populates the GUI window.
    """
    headlines = get_headlines()
    text_widget.delete('1.0', tk.END)  # Clear the current content
    
    if not headlines:
        text_widget.insert(tk.END, "No headlines could be fetched. Please check your internet connection or the RSS feed URLs.")
        return

    for i, headline in enumerate(headlines, 1):
        # Insert the title with bold formatting
        text_widget.insert(tk.END, f"• {headline['title']}\n\n", 'bold')
        # Insert the summary
        text_widget.insert(tk.END, f"{headline['summary']}\n\n", 'summary')
        
        # Create a unique tag for the link to make it clickable
        link_tag = f"link_{i}"
        text_widget.insert(tk.END, f"Read more here...\n\n", (link_tag,))
        
        # Configure the tag to make it look like a link
        text_widget.tag_config(link_tag, foreground="#6699ff", underline=1)
        
        # Bind the click event and the cursor change events
        text_widget.tag_bind(link_tag, '<Button-1>', lambda e, url=headline['link']: on_link_click(url))
        text_widget.tag_bind(link_tag, '<Enter>', lambda e: text_widget.config(cursor="hand2"))
        text_widget.tag_bind(link_tag, '<Leave>', lambda e: text_widget.config(cursor=""))

def create_window():
    """
    Creates the main Tkinter window and starts the ticker.
    """
    global text_widget
    
    root = tk.Tk()
    root.title("My Personalized News Headlines")
    
    # Set the window to a more appealing size
    root.geometry("600x800")
    
    # Create a frame for the scrollbar and text widget
    frame = tk.Frame(root, bg="black", padx=10, pady=10)
    frame.pack(fill=tk.BOTH, expand=True)

    # Create a scrollbar
    scrollbar = tk.Scrollbar(frame)
    scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
    
    # Create a text widget
    text_widget = tk.Text(frame, wrap=tk.WORD, yscrollcommand=scrollbar.set, bg="black", fg="#c0c0c0", relief=tk.FLAT)
    text_widget.pack(fill=tk.BOTH, expand=True)
    
    # Link the scrollbar to the text widget
    scrollbar.config(command=text_widget.yview)

    # Tag for bold headlines and normal text
    text_widget.tag_configure('bold', font=('Helvetica', 14, 'bold'), foreground="#ffffff")
    text_widget.tag_configure('summary', font=('Helvetica', 12), foreground="#c0c0c0")

    # Add a refresh button
    refresh_button = tk.Button(root, text="Refresh", command=update_gui, bg="#4f4f4f", fg="#ffffff", relief=tk.FLAT)
    refresh_button.pack(pady=5)
    
    # Fetch and display headlines on startup
    update_gui()
    
    root.mainloop()

# ----- Main part of the script -----
if __name__ == "__main__":
    create_window()