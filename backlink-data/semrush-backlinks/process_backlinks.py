#!/usr/bin/env python3
"""
Process, deduplicate, and categorize 6,668 raw backlinks for weddinggueststyle.com
"""

import csv
import re
from collections import defaultdict
from urllib.parse import urlparse, urlunparse, parse_qs, urlencode

INPUT_FILE = '/Users/raymond/Desktop/weddinggueststyle.com/backlink-data/semrush-backlinks/ALL_BACKLINKS.csv'
OUTPUT_REPROCESSED = '/Users/raymond/Desktop/weddinggueststyle.com/backlink-data/semrush-backlinks/REPROCESSED_ALL_BACKLINKS.csv'

# Competitor domains to filter out (these are the targets, not referring sites)
COMPETITOR_DOMAINS = set()

# Tracking params to strip
TRACKING_PARAMS = {'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
                   'fbclid', 'gclid', 'msclkid', 'ref', 'source', 'mc_cid', 'mc_eid'}

# Category detection
FORUM_DOMAINS = {'reddit.com', 'quora.com', 'stackexchange.com', 'stackoverflow.com',
                 'weddingwire.com', 'thebump.com'}
FORUM_PATTERNS = ['forum', 'thread', 'discussion', 'community', 'boards', '/t/', '/r/']

WIKI_DOMAINS = {'wikipedia.org', 'wikia.com', 'fandom.com', 'wikihow.com'}
WIKI_PATTERNS = ['wiki']

SOCIAL_DOMAINS = {'facebook.com', 'twitter.com', 'x.com', 'instagram.com', 'pinterest.com',
                  'linkedin.com', 'tiktok.com', 'youtube.com', 'threads.net'}

ECOMMERCE_DOMAINS = {'amazon.com', 'ebay.com', 'etsy.com', 'walmart.com', 'target.com',
                     'nordstrom.com', 'macys.com', 'bloomingdales.com', 'saksfifthavenue.com',
                     'shopify.com', 'asos.com', 'revolve.com', 'lulus.com', 'zappos.com',
                     'jcpenney.com', 'kohls.com', 'anthropologie.com'}

DIRECTORY_DOMAINS = {'yelp.com', 'yellowpages.com', 'bbb.org', 'manta.com', 'superpages.com',
                     'hotfrog.com', 'brownbook.net'}
DIRECTORY_PATTERNS = ['directory', 'listing', 'business-directory']

NEWS_DOMAINS = {'nytimes.com', 'washingtonpost.com', 'cnn.com', 'bbc.com', 'bbc.co.uk',
                'usatoday.com', 'huffpost.com', 'huffingtonpost.com', 'nbcnews.com',
                'abcnews.go.com', 'cbsnews.com', 'foxnews.com', 'reuters.com',
                'apnews.com', 'theguardian.com', 'forbes.com', 'businessinsider.com',
                'cnbc.com', 'bloomberg.com', 'time.com', 'newsweek.com', 'people.com',
                'usmagazine.com', 'eonline.com', 'tmz.com', 'variety.com', 'vox.com',
                'theatlantic.com', 'newyorker.com', 'slate.com', 'salon.com',
                'buzzfeed.com', 'buzzfeednews.com', 'vice.com', 'dailymail.co.uk',
                'independent.co.uk', 'mirror.co.uk', 'express.co.uk', 'metro.co.uk',
                'insider.com', 'yahoo.com', 'msn.com'}

# Niche-relevant: wedding, fashion, style, dress, bridal
NICHE_KEYWORDS = ['wedding', 'bridal', 'bride', 'dress', 'fashion', 'style', 'outfit',
                  'attire', 'gown', 'cocktail', 'formal', 'party', 'guest', 'ceremony',
                  'reception', 'floral', 'maxi', 'midi', 'elegant', 'chic', 'trendy',
                  'plus-size', 'plus size', 'petite', 'maternity', 'modest']

NICHE_DOMAINS = {'vogue.com', 'harpersbazaar.com', 'elle.com', 'glamour.com', 'cosmopolitan.com',
                 'instyle.com', 'marieclaire.com', 'allure.com', 'refinery29.com', 'whowhatwear.com',
                 'theknot.com', 'weddingwire.com', 'brides.com', 'marthastewartweddings.com',
                 'stylemepretty.com', 'junebugweddings.com', 'greenweddingshoes.com',
                 'offbeatbride.com', 'ruffledblog.com', 'snippetandink.com',
                 'southernliving.com', 'townandcountrymag.com', 'travelandleisure.com',
                 'goodhousekeeping.com', 'realsimple.com', 'oprahdaily.com',
                 'today.com', 'popsugar.com', 'byrdie.com', 'theeverygirl.com',
                 'purewow.com', 'brides.com', 'weddingbee.com'}

BLOG_PATTERNS = ['blog', 'article', 'post', 'story', '/p/', 'wordpress', 'blogspot',
                 'medium.com', 'substack.com', 'ghost.io', 'tumblr.com']

SEARCH_ENGINE_DOMAINS = {'google.com', 'google.co', 'bing.com', 'yahoo.com', 'duckduckgo.com',
                         'baidu.com', 'yandex.com', 'yandex.ru', 'search.yahoo.com',
                         'ar.search.yahoo.com', 'fr.search.yahoo.com', 'es.search.yahoo.com',
                         'de.search.yahoo.com', 'uk.search.yahoo.com', 'in.search.yahoo.com',
                         'au.search.yahoo.com', 'naver.com', 'sogou.com', 'so.com',
                         'ask.com', 'aol.com', 'ecosia.org', 'startpage.com', 'qwant.com'}

SPAM_PATTERNS = ['casino', 'poker', 'gambling', 'loan', 'payday', 'viagra', 'cialis',
                 'crypto', 'bitcoin', 'forex', 'weight-loss', 'diet-pill']

PR_DOMAINS = {'prnewswire.com', 'businesswire.com', 'globenewswire.com', 'prweb.com',
              'pr.com', 'newswire.com', 'prbuzz.com'}

ACADEMIC_TLDS = {'.edu', '.ac.uk', '.ac.jp', '.edu.au'}

GOVERNMENT_TLDS = {'.gov', '.gov.uk', '.gov.au'}

# Foreign language detection by domain TLD
FOREIGN_TLDS = {'.cn', '.jp', '.kr', '.ru', '.de', '.fr', '.es', '.it', '.br', '.pt',
                '.pl', '.nl', '.se', '.no', '.dk', '.fi', '.cz', '.ro', '.hu', '.tr',
                '.ar', '.mx', '.co', '.cl', '.pe', '.ve', '.tw', '.th', '.vn', '.id',
                '.my', '.ph', '.sa', '.ae', '.il', '.eg', '.ng', '.ke', '.za'}


def normalize_url(url):
    """Normalize a URL for deduplication."""
    try:
        parsed = urlparse(url.lower().strip())
        # Remove www prefix
        netloc = parsed.netloc
        if netloc.startswith('www.'):
            netloc = netloc[4:]
        # Remove tracking params
        if parsed.query:
            params = parse_qs(parsed.query, keep_blank_values=True)
            filtered = {k: v for k, v in params.items() if k.lower() not in TRACKING_PARAMS}
            query = urlencode(filtered, doseq=True)
        else:
            query = ''
        # Remove fragment
        path = parsed.path.rstrip('/')
        if not path:
            path = ''
        return urlunparse(('https', netloc, path, '', query, ''))
    except Exception:
        return url.strip().lower()


def get_domain(url):
    """Extract root domain from URL."""
    try:
        parsed = urlparse(url)
        netloc = parsed.netloc.lower()
        if netloc.startswith('www.'):
            netloc = netloc[4:]
        return netloc
    except Exception:
        return ''


def is_search_engine(url):
    """Check if URL is from a search engine."""
    domain = get_domain(url)
    # Check exact domain match
    if domain in SEARCH_ENGINE_DOMAINS:
        return True
    # Check if subdomain of search engines
    for se in SEARCH_ENGINE_DOMAINS:
        if domain.endswith('.' + se) or domain == se:
            return True
    # Check common search URL patterns
    url_lower = url.lower()
    if any(p in url_lower for p in ['/search?', '/search/', 'search.yahoo', '.google.', 'bing.com/search']):
        return True
    return False


def is_competitor_self_link(source_url, target_url):
    """Check if source URL is from the same domain as target (competitor self-link)."""
    source_domain = get_domain(source_url)
    target_domain = get_domain(target_url)
    if not source_domain or not target_domain:
        return False
    # Check if same root domain (ignoring subdomains)
    s_parts = source_domain.split('.')
    t_parts = target_domain.split('.')
    if len(s_parts) >= 2 and len(t_parts) >= 2:
        s_root = '.'.join(s_parts[-2:])
        t_root = '.'.join(t_parts[-2:])
        return s_root == t_root
    return source_domain == target_domain


def categorize_url(url, domain):
    """Categorize a URL based on domain and patterns."""
    url_lower = url.lower()

    # Search engines first (filter these out)
    if is_search_engine(url):
        return 'Search Engine - Skip'

    # Government
    for tld in GOVERNMENT_TLDS:
        if domain.endswith(tld):
            return 'Government'

    # Academic
    for tld in ACADEMIC_TLDS:
        if domain.endswith(tld):
            return 'Academic'

    # Social Media
    for sd in SOCIAL_DOMAINS:
        if domain == sd or domain.endswith('.' + sd):
            return 'Social Media'

    # PR/Press Release
    for prd in PR_DOMAINS:
        if domain == prd or domain.endswith('.' + prd):
            return 'PR/Press Release'

    # E-commerce
    for ed in ECOMMERCE_DOMAINS:
        if domain == ed or domain.endswith('.' + ed):
            return 'E-commerce'

    # Wiki
    for wd in WIKI_DOMAINS:
        if domain == wd or domain.endswith('.' + wd):
            return 'Wiki'
    if any(p in url_lower for p in WIKI_PATTERNS):
        return 'Wiki'

    # Forum
    for fd in FORUM_DOMAINS:
        if domain == fd or domain.endswith('.' + fd):
            return 'Forum'
    if any(p in url_lower for p in FORUM_PATTERNS):
        return 'Forum'

    # Directory
    for dd in DIRECTORY_DOMAINS:
        if domain == dd or domain.endswith('.' + dd):
            return 'Directory'
    if any(p in url_lower for p in DIRECTORY_PATTERNS):
        return 'Directory'

    # Spam check
    if any(p in url_lower for p in SPAM_PATTERNS):
        return 'Spam/Scraper'

    # News/Media (check before blog since some are both)
    for nd in NEWS_DOMAINS:
        if domain == nd or domain.endswith('.' + nd):
            return 'Article - News/Media'

    # Niche-specific article
    for nsd in NICHE_DOMAINS:
        if domain == nsd or domain.endswith('.' + nsd):
            return 'Article - Niche Specific'

    # Check if niche relevant based on URL keywords
    niche_match = any(kw in url_lower for kw in NICHE_KEYWORDS)
    if niche_match and any(p in url_lower for p in BLOG_PATTERNS + ['/article', '/post', '/story']):
        return 'Article - Niche Specific'

    # Generic blog/article detection
    if any(p in url_lower for p in BLOG_PATTERNS):
        return 'Article - Blog'

    # Foreign language by TLD
    for ftld in FOREIGN_TLDS:
        if domain.endswith(ftld):
            return 'Foreign Language'

    # Default: check if it looks like a content page
    if re.search(r'/\d{4}/\d{2}/', url_lower):  # Date-based URL = blog
        return 'Article - Blog'
    if re.search(r'/(blog|article|news|post|story|review)s?/', url_lower):
        return 'Article - Blog'

    return 'Other/Uncategorized'


def is_niche_relevant(url, domain, anchor):
    """Check if a URL is relevant to wedding guest dresses niche."""
    text = (url + ' ' + domain + ' ' + (anchor or '')).lower()
    # Check niche domains
    for nd in NICHE_DOMAINS:
        if domain == nd or domain.endswith('.' + nd):
            return True
    # Check niche keywords
    return any(kw in text for kw in NICHE_KEYWORDS)


def main():
    print("Step 1: Reading raw backlinks...")

    # Read all backlinks
    raw_rows = []
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            raw_rows.append(row)

    print(f"  Raw rows: {len(raw_rows)}")

    # Step 2: Filter and deduplicate
    print("\nStep 2: Filtering and deduplicating...")

    # Track unique source URLs with their metadata
    url_data = {}  # normalized_url -> {domain, full_url, competitors: set, keywords: set, anchors: set, authority}

    filtered_search = 0
    filtered_self = 0
    filtered_empty = 0

    for row in raw_rows:
        source_url = row.get('Source URL', '').strip()
        target_url = row.get('Target URL', '').strip()
        competitor_url = row.get('Competitor URL', '').strip()
        keyword = row.get('Keyword', '').strip()
        anchor = row.get('Anchor', '').strip()
        authority = row.get('Authority', '').strip()

        if not source_url:
            filtered_empty += 1
            continue

        # Filter search engines
        if is_search_engine(source_url):
            filtered_search += 1
            continue

        # Filter competitor self-links
        if is_competitor_self_link(source_url, target_url):
            filtered_self += 1
            continue

        # Normalize
        norm_url = normalize_url(source_url)
        domain = get_domain(source_url)

        if not domain:
            filtered_empty += 1
            continue

        if norm_url not in url_data:
            url_data[norm_url] = {
                'domain': domain,
                'full_url': source_url,
                'competitors': set(),
                'keywords': set(),
                'anchors': set(),
                'authority': authority
            }

        comp_domain = get_domain(competitor_url)
        if comp_domain:
            url_data[norm_url]['competitors'].add(comp_domain)
        if keyword:
            url_data[norm_url]['keywords'].add(keyword)
        if anchor and len(anchor) > 2:
            url_data[norm_url]['anchors'].add(anchor)
        if authority and not url_data[norm_url]['authority']:
            url_data[norm_url]['authority'] = authority

    print(f"  Filtered - search engines: {filtered_search}")
    print(f"  Filtered - self-links: {filtered_self}")
    print(f"  Filtered - empty/invalid: {filtered_empty}")
    print(f"  Unique source URLs after dedup: {len(url_data)}")

    # Step 3: Categorize
    print("\nStep 3: Categorizing...")

    category_counts = defaultdict(int)
    results = []

    for norm_url, data in url_data.items():
        category = categorize_url(data['full_url'], data['domain'])
        niche_rel = is_niche_relevant(data['full_url'], data['domain'],
                                       ' '.join(data['anchors']) if data['anchors'] else '')

        category_counts[category] += 1

        results.append({
            'Category': category,
            'Domain': data['domain'],
            'Full URL': data['full_url'],
            'Found From Competitors': '; '.join(sorted(data['competitors'])),
            'Competitor Count': len(data['competitors']),
            'Keywords': '; '.join(sorted(data['keywords'])),
            'Anchor Text': '; '.join(sorted(data['anchors']))[:200] if data['anchors'] else '',
            'Authority': data['authority'],
            'Niche Relevant': 'Yes' if niche_rel else 'No'
        })

    # Sort by: niche relevant first, then competitor count desc, then category
    results.sort(key=lambda x: (-int(x['Niche Relevant'] == 'Yes'), -x['Competitor Count'], x['Category']))

    # Write output
    print(f"\nStep 4: Writing {OUTPUT_REPROCESSED}...")

    fieldnames = ['Category', 'Domain', 'Full URL', 'Found From Competitors',
                  'Competitor Count', 'Keywords', 'Anchor Text', 'Authority', 'Niche Relevant']

    with open(OUTPUT_REPROCESSED, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, quoting=csv.QUOTE_ALL)
        writer.writeheader()
        writer.writerows(results)

    # Print summary
    print(f"\n{'='*60}")
    print("PROCESSING COMPLETE")
    print(f"{'='*60}")
    print(f"\nTotal raw rows: {len(raw_rows)}")
    print(f"After filtering & dedup: {len(results)} unique URLs")
    print(f"\nCategory breakdown:")
    for cat, count in sorted(category_counts.items(), key=lambda x: -x[1]):
        print(f"  {cat}: {count}")

    niche_count = sum(1 for r in results if r['Niche Relevant'] == 'Yes')
    print(f"\nNiche relevant: {niche_count}")
    print(f"Non-niche: {len(results) - niche_count}")

    # Domain diversity
    unique_domains = set(r['Domain'] for r in results if r['Category'] != 'Search Engine - Skip')
    print(f"\nUnique referring domains: {len(unique_domains)}")

    # Multi-competitor URLs (linked by multiple competitors = higher value)
    multi = sum(1 for r in results if r['Competitor Count'] >= 3)
    print(f"URLs found from 3+ competitors: {multi}")


if __name__ == '__main__':
    main()
