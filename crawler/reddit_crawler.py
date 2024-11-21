import praw
import requests

# Initialize Reddit API
reddit = praw.Reddit(
    client_id='WsclGJjb_JCK0fewwULu5A',          # Your client ID
    client_secret='lB_YxjhBfFdAH88SKvw9nrCgQEbzDw',  # Your client secret
    user_agent='Model Ranking by Difficult-Check-1934'  # Custom user agent
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
        requests.post(url, json=post)

# Run crawler
if __name__ == "__main__":
    posts = fetch_posts("programming", 5)
    send_to_backend(posts)
