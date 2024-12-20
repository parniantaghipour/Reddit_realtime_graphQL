import praw
import requests

# Initialize Reddit API
reddit = praw.Reddit(
    client_id='',          # Your client ID
    client_secret='',  # Your client secret
    user_agent=''  # Custom user agent
)

# Fetch posts
def fetch_posts(subreddit_name, limit=10):
    subreddit = reddit.subreddit(subreddit_name)
    posts = []
    for post in subreddit.new(limit=limit):
        posts.append({
            "id": post.id,
            "title": post.title,
            "url": post.url,
            "score": post.score,
            "created_utc": post.created_utc,
        })
    return posts

# Send data to the backend
def send_to_backend(posts):
    url = "http://localhost:4000/crawl"
    for post in posts:
        response = requests.post(url, json=post)
        print(f"Response from backend: {response.status_code}")  # Log the response status


# Run crawler
if __name__ == "__main__":
    posts = fetch_posts("programming", 10)
    send_to_backend(posts)
    
