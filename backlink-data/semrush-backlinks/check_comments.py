#!/usr/bin/env python3
"""
Check all backlink URLs for comment sections and label opportunity types.
Uses concurrent HTTP requests for speed.
Customized for weddinggueststyle.com backlink data.
"""

import csv
import re
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.parse import urlparse
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

INPUT_FILE = 'REPROCESSED_ALL_BACKLINKS.csv'
OUTPUT_FILE = 'BACKLINKS_LABELED.csv'

# Categories that don't need HTTP checking - we auto-assign opportunity type
AUTO_LABELS = {
    'Forum': 'Forum - Can Join & Post',
    'Forum - Reddit': 'Forum - Reddit Post/Comment',
    'Spam/Scraper - Skip': 'Skip - Spam/Scraper',
    'Search Engine - Skip': 'Skip - Search Engine',
    'Email Tracking - Skip': 'Skip - Email Tracking',
    'Email Newsletter Archive': 'Email Archive - Monitor Only',
    'AI Content Site': 'AI Content - Low Outreach Value',
    'E-commerce': 'E-commerce - Product Page',
    'PR/Press Release': 'PR/Press Release - Distribution Channel',
    'Wiki': 'Wiki - Can Edit/Contribute',
    'Academic': 'Academic - Citation Opportunity',
    'Directory': 'Directory - Can Submit Listing',
    'Social Media': 'Social Media - Can Engage',
    'Government': 'Government - No Interaction',
    'Foreign Language': 'Foreign Language - Skip',
    'Other/Uncategorized': 'Other - Needs Review',
}

# Comment detection patterns
COMMENT_FORM_PATTERNS = [
    r'wp-comments-post\.php',
    r'id=["\']respond["\']',
    r'class=["\'][^"\']*comment-respond',
    r'class=["\'][^"\']*comment-form',
    r'id=["\']commentform["\']',
    r'id=["\']comments["\']',
    r'class=["\'][^"\']*comments-area',
    r'<textarea[^>]*comment',
    r'name=["\']comment["\']',
    r'Leave a [Rr]eply',
    r'Leave a [Cc]omment',
    r'Add a [Cc]omment',
    r'Post a [Cc]omment',
    r'id=["\']disqus_thread["\']',
    r'disqus\.com/embed',
    r'class=["\'][^"\']*disqus',
    r'spot\.im',
    r'data-spot-im',
    r'coral_thread',
    r'vuukle',
    r'livefyre',
    r'class=["\'][^"\']*CommentSection',
    r'class=["\'][^"\']*comment-section',
    r'id=["\']comment-section["\']',
]

COMMENTS_CLOSED_PATTERNS = [
    r'comments.{0,10}closed',
    r'comments.{0,10}disabled',
    r'comments.{0,10}turned off',
    r'commenting.{0,10}closed',
    r'class=["\'][^"\']*comments--closed',
]

LOGIN_REQUIRED_PATTERNS = [
    r'log\s*in\s+to\s+comment',
    r'sign\s*in\s+to\s+comment',
    r'log\s*in\s+to\s+post',
    r'sign\s*in\s+to\s+post',
    r'log\s*in\s+to\s+reply',
    r'sign\s*in\s+to\s+reply',
    r'must\s+be\s+logged\s+in',
    r'please\s+log\s*in',
    r'register\s+to\s+comment',
    r'sign\s*up\s+to\s+comment',
    r'create.{0,20}account.{0,20}comment',
]

FORUM_PATTERNS_HTML = [
    r'phpbb',
    r'vbulletin',
    r'xenforo',
    r'discourse',
    r'class=["\'][^"\']*forum',
    r'class=["\'][^"\']*thread',
    r'class=["\'][^"\']*topic-list',
    r'class=["\'][^"\']*post-reply',
    r'/forum/',
    r'/thread/',
    r'/topic/',
]


def create_session():
    """Create a requests session with retries."""
    session = requests.Session()
    retry = Retry(total=1, backoff_factor=0.5, status_forcelist=[500, 502, 503, 504])
    adapter = HTTPAdapter(max_retries=retry, pool_connections=20, pool_maxsize=20)
    session.mount('http://', adapter)
    session.mount('https://', adapter)
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
    })
    return session


def check_url(url_info):
    """Check a single URL for comment sections."""
    idx, url, category, domain = url_info
    full_url = 'https://' + url if not url.startswith('http') else url

    try:
        session = create_session()
        resp = session.get(full_url, timeout=8, allow_redirects=True,
                          verify=False, stream=True)

        # Only read first 200KB to save time
        content = ''
        for chunk in resp.iter_content(chunk_size=1024, decode_unicode=True):
            if isinstance(chunk, bytes):
                try:
                    chunk = chunk.decode('utf-8', errors='ignore')
                except:
                    chunk = str(chunk)
            content += chunk
            if len(content) > 200000:
                break
        resp.close()
        session.close()

        html_lower = content.lower()

        # Check if it's actually a forum
        forum_score = sum(1 for p in FORUM_PATTERNS_HTML if re.search(p, html_lower))
        if forum_score >= 2:
            return (idx, 'Forum - Can Join & Post', resp.status_code)

        # Check for comments
        has_comments = any(re.search(p, html_lower) for p in COMMENT_FORM_PATTERNS)
        comments_closed = any(re.search(p, html_lower) for p in COMMENTS_CLOSED_PATTERNS)
        login_required = any(re.search(p, html_lower) for p in LOGIN_REQUIRED_PATTERNS)

        if has_comments and comments_closed:
            return (idx, 'Blog/Article - Comments Closed', resp.status_code)
        elif has_comments and login_required:
            return (idx, 'Blog/Article - Comments (Login Required)', resp.status_code)
        elif has_comments:
            return (idx, 'Blog/Article - Comments Open (No Login)', resp.status_code)
        else:
            return (idx, 'Blog/Article - No Comment Section', resp.status_code)

    except requests.exceptions.Timeout:
        return (idx, 'Unreachable - Timeout', 0)
    except requests.exceptions.ConnectionError:
        return (idx, 'Unreachable - Connection Error', 0)
    except Exception as e:
        return (idx, f'Error - {str(e)[:50]}', 0)


def main():
    # Read all backlinks
    rows = []
    with open(INPUT_FILE, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)

    print(f"Total URLs: {len(rows)}")

    # Separate into auto-label and needs-check
    to_check = []
    results = {}  # idx -> label

    for i, row in enumerate(rows):
        cat = row['Category']
        if cat in AUTO_LABELS:
            results[i] = AUTO_LABELS[cat]
        elif cat.startswith('Article'):
            # These need HTTP checking for comment detection
            to_check.append((i, row['Full URL'], cat, row['Domain']))
        else:
            results[i] = 'Other - Needs Review'

    print(f"Auto-labeled: {len(results)}")
    print(f"Need HTTP check (articles/blogs): {len(to_check)}")
    print(f"\nChecking URLs with 20 concurrent threads...")

    # Check URLs concurrently
    completed = 0
    with ThreadPoolExecutor(max_workers=20) as executor:
        futures = {executor.submit(check_url, info): info for info in to_check}
        for future in as_completed(futures):
            idx, label, status = future.result()
            results[idx] = label
            completed += 1
            if completed % 50 == 0:
                print(f"  Checked {completed}/{len(to_check)} URLs...")

    print(f"\nDone! All {len(to_check)} URLs checked.")

    # Write output with all original columns plus Opportunity Type
    with open(OUTPUT_FILE, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f, quoting=csv.QUOTE_ALL)
        writer.writerow(['Opportunity Type', 'Category', 'Domain', 'Full URL',
                        'Found From Competitors', 'Competitor Count', 'Keywords',
                        'Anchor Text', 'Authority', 'Niche Relevant'])
        for i, row in enumerate(rows):
            label = results.get(i, 'Unknown')
            writer.writerow([label, row['Category'], row['Domain'], row['Full URL'],
                           row['Found From Competitors'], row['Competitor Count'],
                           row.get('Keywords', ''), row.get('Anchor Text', ''),
                           row.get('Authority', ''), row['Niche Relevant']])

    # Print summary
    from collections import Counter
    label_counts = Counter(results.values())
    print(f"\n{'='*60}")
    print(f"RESULTS SUMMARY")
    print(f"{'='*60}")
    for label, count in sorted(label_counts.items(), key=lambda x: -x[1]):
        print(f"  {count:>5}  {label}")
    print(f"{'='*60}")
    print(f"  {sum(label_counts.values()):>5}  TOTAL")

    # Highlight actionable targets
    actionable_labels = ['Blog/Article - Comments Open (No Login)',
                         'Blog/Article - Comments (Login Required)',
                         'Forum - Can Join & Post',
                         'Forum - Reddit Post/Comment',
                         'Wiki - Can Edit/Contribute',
                         'Directory - Can Submit Listing']
    actionable_count = sum(label_counts.get(l, 0) for l in actionable_labels)
    print(f"\n*** ACTIONABLE OUTREACH TARGETS: {actionable_count} ***")
    for l in actionable_labels:
        c = label_counts.get(l, 0)
        if c > 0:
            print(f"  {c:>5}  {l}")

    print(f"\nSaved to {OUTPUT_FILE}")


if __name__ == '__main__':
    import urllib3
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
    main()
