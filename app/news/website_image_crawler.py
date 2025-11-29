import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from PIL import Image
from io import BytesIO

def download_images(url, output_folder="downloaded_images", target_width=1920, target_height=1080, max_images=1000):
    """
    Crawls a given URL and downloads images that match the target dimensions, up to a specified limit.
    """
    try:
        # Create output folder if it doesn't exist
        if not os.path.exists(output_folder):
            os.makedirs(output_folder)
            print(f"Created output directory: {output_folder}")

        # Fetch the HTML content
        print(f"Fetching content from: {url}")
        response = requests.get(url)
        response.raise_for_status()

        # Parse the HTML with BeautifulSoup
        soup = BeautifulSoup(response.text, 'html.parser')

        # Find all image tags
        img_tags = soup.find_all('img')

        # Initialize image counter
        images_downloaded_count = 0

        # Iterate and download each image
        for img in img_tags:
            # Check if the download limit has been reached
            if images_downloaded_count >= max_images:
                print(f"Download limit of {max_images} images reached. Stopping.")
                break

            img_url = img.get('src')
            if not img_url:
                continue

            # Resolve relative URLs
            full_img_url = urljoin(url, img_url)

            # Check if the URL is valid
            if not urlparse(full_img_url).scheme in ['http', 'https']:
                continue

            try:
                # Use stream=True to download the image in chunks
                print(f"Checking image: {full_img_url}")
                img_response = requests.get(full_img_url, stream=True)
                img_response.raise_for_status()

                # Read image data into memory and get dimensions
                img_stream = BytesIO(img_response.content)
                img_data = Image.open(img_stream)
                width, height = img_data.size

                # Check if dimensions match the target
                if width == target_width and height == target_height:
                    img_name = os.path.basename(urlparse(full_img_url).path)
                    if not img_name:
                        continue
                    
                    # Save the image if it matches the criteria
                    with open(os.path.join(output_folder, img_name), 'wb') as f:
                        f.write(img_stream.getbuffer())
                    print(f"Successfully saved matching image: {img_name}")
                    images_downloaded_count += 1
                else:
                    print(f"Skipping image (dimensions {width}x{height} do not match {target_width}x{target_height})")

            # Update the exception handling to include IOError
            except (requests.exceptions.RequestException, IOError) as e:
                print(f"Error processing {full_img_url}: {e}")

    except requests.exceptions.RequestException as e:
        print(f"Error fetching URL: {e}")

# The part you have to change is below. 
# Make sure to put your desired URL inside the quotes.
# ---------------------------------------------------------------------------------------------------
if __name__ == '__main__':
    # === 🖼️ YOUR SETTINGS GO HERE ===
    
    # 1. The URL of the website you want to crawl.
    TARGET_URL = "https://babesource.com/"
    
    # 2. The folder where the images will be saved.
    OUTPUT_FOLDER = "my_downloaded_images"

    # 3. The exact width and height you want the images to be.
    TARGET_WIDTH = 1920
    TARGET_HEIGHT = 1080

    # 4. The maximum number of images to download.
    MAX_IMAGES = 1000

    # ===============================

    download_images(
        TARGET_URL,
        output_folder=OUTPUT_FOLDER,
        target_width=TARGET_WIDTH,
        target_height=TARGET_HEIGHT,
        max_images=MAX_IMAGES
    )