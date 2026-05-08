#!/usr/bin/env python3
"""
Process, deduplicate, and categorize 6,668 raw backlinks for weddinggueststyle.com
v2: Better categorization based on actual data patterns
"""

import csv
import re
from collections import defaultdict, Counter
from urllib.parse import urlparse, urlunparse, parse_qs, urlencode

INPUT_FILE = '/Users/raymond/Desktop/weddinggueststyle.com/backlink-data/semrush-backlinks/ALL_BACKLINKS.csv'
OUTPUT_REPROCESSED = '/Users/raymond/Desktop/weddinggueststyle.com/backlink-data/semrush-backlinks/REPROCESSED_ALL_BACKLINKS.csv'

# Tracking params to strip
TRACKING_PARAMS = {'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
                   'fbclid', 'gclid', 'msclkid', 'ref', 'source', 'mc_cid', 'mc_eid'}

# =====================================================
# SEARCH ENGINES & AGGREGATORS (SKIP)
# =====================================================
SEARCH_ENGINE_DOMAINS = {'google.com', 'bing.com', 'yahoo.com', 'duckduckgo.com',
                         'baidu.com', 'yandex.com', 'yandex.ru', 'naver.com', 'sogou.com',
                         'so.com', 'ask.com', 'aol.com', 'ecosia.org', 'startpage.com', 'qwant.com'}
# These appear as subdomains too
SEARCH_SUBDOMAINS = {'search.yahoo.com', 'ar.search.yahoo.com', 'fr.search.yahoo.com',
                     'es.search.yahoo.com', 'de.search.yahoo.com', 'uk.search.yahoo.com',
                     'in.search.yahoo.com', 'au.search.yahoo.com', 'br.search.yahoo.com',
                     'id.search.yahoo.com', 'sg.search.yahoo.com'}
AGGREGATOR_DOMAINS = {'p.eurekster.com', 'eurekster.com'}

# =====================================================
# SPAM / SCRAPER / LOW VALUE (SKIP)
# =====================================================
SPAM_DOMAINS = {'topworldproduct.com', 'oregongrassfed.com', 'macronet.org',
                'chilfeed.site', 'buzzharboralerts.com', 'newhopechina.org',
                'shopyourway.com', 'sanya101.com', 'bountyjobs.com',
                'tipsandwishes.com', 'hotmomsclub.com'}
SPAM_PATTERNS = ['casino', 'poker', 'gambling', 'loan', 'payday', 'viagra', 'cialis',
                 'crypto-', 'bitcoin-', 'forex-', 'weight-loss-pill', 'diet-pill-']

# =====================================================
# EMAIL NEWSLETTER ARCHIVES (low value for outreach)
# =====================================================
EMAIL_DOMAINS = {'milled.com', 'emailsnest.com', 'emaillove.com', 'reallygoodemails.com',
                 'emailgallery.com'}
EMAIL_TRACKING_DOMAINS = {'ctrk.klclick.com', 'ctrk.klclick1.com', 'tonicsiteshop.lt.acemlnb.com',
                          'acemlnb.com', 'acemlna.com', 'list-manage.com', 'mailchi.mp'}

# =====================================================
# E-COMMERCE (review/link opportunities on product pages)
# =====================================================
ECOMMERCE_DOMAINS = {'amazon.com', 'ebay.com', 'etsy.com', 'walmart.com', 'target.com',
                     'nordstrom.com', 'macys.com', 'bloomingdales.com', 'saksfifthavenue.com',
                     'asos.com', 'revolve.com', 'lulus.com', 'zappos.com',
                     'jcpenney.com', 'kohls.com', 'shopbop.com', 'neimanmarcus.com',
                     'therealreal.com', 'poshmark.com', 'thredup.com',
                     'accio.com', 'temu.com', 'shein.com', 'alibaba.com',
                     'aliexpress.com', 'wish.com', 'dhgate.com'}

# =====================================================
# SOCIAL MEDIA
# =====================================================
SOCIAL_DOMAINS = {'facebook.com', 'twitter.com', 'x.com', 'instagram.com', 'pinterest.com',
                  'linkedin.com', 'tiktok.com', 'youtube.com', 'threads.net', 'snapchat.com',
                  'reddit.com'}

# =====================================================
# FORUMS (Reddit is also social, but forum behavior)
# =====================================================
FORUM_DOMAINS = {'quora.com', 'stackexchange.com', 'stackoverflow.com',
                 'weddingwire.com', 'thebump.com', 'weddingbee.com',
                 'boards.weddingbee.com'}
FORUM_PATTERNS = ['/forum', '/thread', '/discussion', '/community/', '/boards/']

# =====================================================
# WIKI
# =====================================================
WIKI_DOMAINS = {'wikipedia.org', 'wikia.com', 'fandom.com', 'wikihow.com'}

# =====================================================
# DIRECTORIES
# =====================================================
DIRECTORY_DOMAINS = {'yelp.com', 'yellowpages.com', 'bbb.org', 'manta.com',
                     'hotfrog.com', 'brownbook.net', 'crunchbase.com'}

# =====================================================
# NEWS/MEDIA (major publications)
# =====================================================
NEWS_DOMAINS = {'nytimes.com', 'washingtonpost.com', 'cnn.com', 'bbc.com', 'bbc.co.uk',
                'usatoday.com', 'huffpost.com', 'nbcnews.com', 'abcnews.go.com',
                'cbsnews.com', 'foxnews.com', 'reuters.com', 'apnews.com',
                'theguardian.com', 'forbes.com', 'businessinsider.com', 'insider.com',
                'cnbc.com', 'bloomberg.com', 'time.com', 'newsweek.com', 'people.com',
                'usmagazine.com', 'eonline.com', 'variety.com', 'vox.com',
                'theatlantic.com', 'newyorker.com', 'buzzfeed.com', 'vice.com',
                'dailymail.co.uk', 'independent.co.uk', 'today.com', 'msn.com',
                'swimsuit.si.com', 'si.com', 'goodmorningamerica.com'}

# =====================================================
# NICHE SPECIFIC - Wedding/Fashion/Style (HIGH VALUE)
# =====================================================
NICHE_DOMAINS = {
    # Wedding-specific
    'theknot.com', 'brides.com', 'marthastewartweddings.com',
    'stylemepretty.com', 'junebugweddings.com', 'greenweddingshoes.com',
    'offbeatbride.com', 'ruffledblog.com', 'snippetandink.com',
    'weddingchicks.com', 'bridalmusings.com', 'lovemydress.net',
    'rockmywedding.co.uk', 'apracticalwedding.com', 'loveincmag.com',
    'snippetandink.com', 'ido101.com', 'dressforthewedding.com',
    'mywedding.com', 'zola.com', 'davidsbridal.com',
    'bridechilla.com', 'weddingforward.com', 'hitched.co.uk',
    'confetti.co.uk', 'weddingideasmag.com',
    # Fashion/Style publications
    'vogue.com', 'harpersbazaar.com', 'elle.com', 'glamour.com',
    'cosmopolitan.com', 'instyle.com', 'marieclaire.com', 'allure.com',
    'refinery29.com', 'whowhatwear.com', 'popsugar.com', 'byrdie.com',
    'theeverygirl.com', 'purewow.com', 'townandcountrymag.com',
    'travelandleisure.com', 'goodhousekeeping.com', 'realsimple.com',
    'oprahdaily.com', 'southernliving.com', 'marthastewart.com',
    'bhg.com', 'womenshealthmag.com', 'self.com', 'prevention.com',
    'redbookmag.com', 'countryliving.com', 'womansday.com',
    'elledecor.com', 'mindbodygreen.com',
    # Fashion/style blogs & sites
    'newyorkstyleguide.com', 'rubyandthewolf.com', 'astricknation.com',
    'theblondesalad.com', 'manrepeller.com', 'cupofjo.com',
    'stylecaster.com', 'thestyleline.com', 'stylebistro.com',
    'collegiatestandard.com', 'fashionista.com', 'editorialist.com',
    'thefashionspot.com', 'fashiongonerogue.com', 'coveteur.com',
    'thezoereport.com', 'bustle.com', 'brit.co', 'domino.com',
    'mydomaine.com', 'thespruce.com', 'blessthismessplease.com',
    'luluandgeorgia.com', 'thepinnaclelist.com',
    'digitalfashionacademy.com', 'usefuldiary.com',
    # Plus-size / body-positive fashion
    'thecurvyfashionista.com', 'curvygirlstyles.com',
    'plussizeprincess.com', 'gabifresh.com',
}

# =====================================================
# AI-GENERATED CONTENT SITES (low outreach value)
# =====================================================
AI_CONTENT_DOMAINS = {'bestieai.app', 'jasper.ai'}

# =====================================================
# PR / PRESS RELEASE
# =====================================================
PR_DOMAINS = {'prnewswire.com', 'businesswire.com', 'globenewswire.com', 'prweb.com',
              'newswire.com', 'prbuzz.com'}

# =====================================================
# NICHE KEYWORDS for relevance scoring
# =====================================================
NICHE_KEYWORDS = ['wedding', 'bridal', 'bride', 'dress', 'fashion', 'style', 'outfit',
                  'attire', 'gown', 'cocktail', 'formal', 'party', 'guest', 'ceremony',
                  'reception', 'floral', 'maxi', 'midi', 'elegant', 'chic', 'trendy',
                  'plus-size', 'plus size', 'petite', 'maternity', 'modest', 'summer',
                  'winter', 'fall', 'spring', 'beach', 'garden', 'black-tie',
                  'semi-formal', 'casual', 'wear', 'wardrobe', 'clothing']

# Foreign TLDs
FOREIGN_TLDS = {'.cn', '.jp', '.kr', '.ru', '.de', '.fr', '.es', '.it', '.br', '.pt',
                '.pl', '.nl', '.se', '.no', '.dk', '.fi', '.cz', '.ro', '.hu', '.tr',
                '.ar', '.mx', '.tw', '.th', '.vn', '.id', '.my', '.ph', '.sa', '.ae'}


def normalize_url(url):
    """Normalize a URL for deduplication."""
    try:
        parsed = urlparse(url.lower().strip())
        netloc = parsed.netloc
        if netloc.startswith('www.'):
            netloc = netloc[4:]
        if parsed.query:
            params = parse_qs(parsed.query, keep_blank_values=True)
            filtered = {k: v for k, v in params.items() if k.lower() not in TRACKING_PARAMS}
            query = urlencode(filtered, doseq=True)
        else:
            query = ''
        path = parsed.path.rstrip('/')
        if not path:
            path = ''
        return urlunparse(('https', netloc, path, '', query, ''))
    except Exception:
        return url.strip().lower()


def get_domain(url):
    """Extract domain from URL (without www.)."""
    try:
        parsed = urlparse(url)
        netloc = parsed.netloc.lower()
        if netloc.startswith('www.'):
            netloc = netloc[4:]
        return netloc
    except Exception:
        return ''


def get_root_domain(domain):
    """Get root domain (last 2 parts) for matching."""
    parts = domain.split('.')
    if len(parts) >= 2:
        return '.'.join(parts[-2:])
    return domain


def domain_matches(domain, domain_set):
    """Check if domain or its root matches any in the set."""
    if domain in domain_set:
        return True
    root = get_root_domain(domain)
    if root in domain_set:
        return True
    # Check if subdomain of any in set
    for d in domain_set:
        if domain.endswith('.' + d):
            return True
    return False


def is_search_engine(url, domain):
    """Check if URL is from a search engine."""
    if domain_matches(domain, SEARCH_ENGINE_DOMAINS):
        return True
    if domain in SEARCH_SUBDOMAINS or domain_matches(domain, AGGREGATOR_DOMAINS):
        return True
    url_lower = url.lower()
    if any(p in url_lower for p in ['/search?', 'search.yahoo']):
        return True
    return False


def is_email_tracking(url, domain):
    """Check if URL is an email tracking link."""
    if domain_matches(domain, EMAIL_TRACKING_DOMAINS):
        return True
    # Common email tracking patterns
    url_lower = url.lower()
    if any(p in url_lower for p in ['acemln', 'klclick', 'list-manage.com', 'mailchi.mp',
                                     'campaign-archive', 'email.mg.', 'links.e.']):
        return True
    return False


def is_competitor_self_link(source_url, target_url):
    """Check if source URL is from the same domain as target."""
    source_domain = get_root_domain(get_domain(source_url))
    target_domain = get_root_domain(get_domain(target_url))
    return source_domain == target_domain and source_domain != ''


def categorize_url(url, domain):
    """Categorize a URL based on domain and patterns."""
    url_lower = url.lower()
    root = get_root_domain(domain)

    # Search engines & aggregators
    if is_search_engine(url, domain):
        return 'Search Engine - Skip'

    # Email tracking
    if is_email_tracking(url, domain):
        return 'Email Tracking - Skip'

    # Spam/scraper
    if domain_matches(domain, SPAM_DOMAINS):
        return 'Spam/Scraper - Skip'
    if any(p in url_lower for p in SPAM_PATTERNS):
        return 'Spam/Scraper - Skip'

    # AI-generated content
    if domain_matches(domain, AI_CONTENT_DOMAINS):
        return 'AI Content Site'

    # Email newsletter archives
    if domain_matches(domain, EMAIL_DOMAINS):
        return 'Email Newsletter Archive'

    # Government
    if any(domain.endswith(tld) for tld in ['.gov', '.gov.uk', '.gov.au']):
        return 'Government'

    # Academic
    if any(domain.endswith(tld) for tld in ['.edu', '.ac.uk', '.ac.jp', '.edu.au']):
        return 'Academic'

    # Social Media (Reddit treated separately as forum)
    if root == 'reddit.com' or domain.endswith('.reddit.com'):
        return 'Forum - Reddit'
    if domain_matches(domain, SOCIAL_DOMAINS):
        return 'Social Media'

    # PR/Press Release
    if domain_matches(domain, PR_DOMAINS):
        return 'PR/Press Release'

    # Wiki
    if domain_matches(domain, WIKI_DOMAINS):
        return 'Wiki'

    # Directory
    if domain_matches(domain, DIRECTORY_DOMAINS):
        return 'Directory'

    # Forums
    if domain_matches(domain, FORUM_DOMAINS):
        return 'Forum'
    if any(p in url_lower for p in FORUM_PATTERNS):
        return 'Forum'

    # E-commerce
    if domain_matches(domain, ECOMMERCE_DOMAINS):
        return 'E-commerce'

    # Niche-specific (wedding/fashion) - highest value for outreach
    if domain_matches(domain, NICHE_DOMAINS):
        return 'Article - Niche Specific'

    # News/Media
    if domain_matches(domain, NEWS_DOMAINS):
        return 'Article - News/Media'

    # Foreign language by TLD
    for ftld in FOREIGN_TLDS:
        if domain.endswith(ftld):
            return 'Foreign Language'

    # Content detection by URL patterns
    if re.search(r'/blog/', url_lower) or re.search(r'/\d{4}/\d{2}/', url_lower):
        if any(kw in url_lower for kw in NICHE_KEYWORDS):
            return 'Article - Niche Specific'
        return 'Article - Blog'

    if re.search(r'/(article|post|story|news)/', url_lower):
        if any(kw in url_lower for kw in NICHE_KEYWORDS):
            return 'Article - Niche Specific'
        return 'Article - Blog'

    # If domain has niche keywords, likely niche-relevant content
    if any(kw in domain for kw in ['wedding', 'bridal', 'bride', 'dress', 'fashion',
                                    'style', 'gown', 'formal']):
        return 'Article - Niche Specific'

    # If URL path has strong niche signals
    niche_url_hits = sum(1 for kw in NICHE_KEYWORDS if kw in url_lower)
    if niche_url_hits >= 2:
        return 'Article - Niche Specific'

    # If it has content-like URL structure
    if re.search(r'/[a-z]+-[a-z]+-[a-z]+', url_lower):  # Slug-like URL
        if any(kw in url_lower for kw in NICHE_KEYWORDS):
            return 'Article - Niche Specific'
        return 'Article - Blog'

    # Catch remaining sites with niche keywords in URL
    if any(kw in url_lower for kw in ['wedding', 'bridal', 'dress', 'guest']):
        return 'Article - Niche Specific'

    return 'Other/Uncategorized'


def is_niche_relevant(url, domain, anchor):
    """Check if a URL is relevant to wedding guest dresses niche."""
    text = (url + ' ' + domain + ' ' + (anchor or '')).lower()
    if domain_matches(domain, NICHE_DOMAINS):
        return True
    return any(kw in text for kw in NICHE_KEYWORDS)


def main():
    print("Step 1: Reading raw backlinks...")

    raw_rows = []
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            raw_rows.append(row)

    print(f"  Raw rows: {len(raw_rows)}")

    print("\nStep 2: Filtering and deduplicating...")

    url_data = {}
    filtered_search = 0
    filtered_self = 0
    filtered_empty = 0
    filtered_email_track = 0

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

        domain = get_domain(source_url)
        if not domain:
            filtered_empty += 1
            continue

        # Filter search engines early
        if is_search_engine(source_url, domain):
            filtered_search += 1
            continue

        # Filter email tracking
        if is_email_tracking(source_url, domain):
            filtered_email_track += 1
            continue

        # Filter competitor self-links
        if is_competitor_self_link(source_url, target_url):
            filtered_self += 1
            continue

        # Normalize
        norm_url = normalize_url(source_url)

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
    print(f"  Filtered - email tracking: {filtered_email_track}")
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

    # Sort: niche relevant first, then competitor count desc, then category
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
        pct = count / len(results) * 100
        print(f"  {cat}: {count} ({pct:.1f}%)")

    niche_count = sum(1 for r in results if r['Niche Relevant'] == 'Yes')
    print(f"\nNiche relevant: {niche_count}")
    print(f"Non-niche: {len(results) - niche_count}")

    unique_domains = set(r['Domain'] for r in results
                         if 'Skip' not in r['Category'])
    print(f"\nUnique referring domains (excl. skipped): {len(unique_domains)}")

    multi = sum(1 for r in results if r['Competitor Count'] >= 3)
    print(f"URLs found from 3+ competitors: {multi}")

    # Actionable targets (exclude skip categories)
    actionable = [r for r in results if 'Skip' not in r['Category']]
    print(f"\nActionable targets: {len(actionable)}")

    # Blog/article targets (prime for comment outreach)
    articles = [r for r in results if r['Category'].startswith('Article')]
    print(f"Blog/article targets: {len(articles)}")
    niche_articles = [r for r in articles if r['Niche Relevant'] == 'Yes']
    print(f"  - Niche-specific articles: {len(niche_articles)}")

    # Forum targets
    forums = [r for r in results if r['Category'].startswith('Forum')]
    print(f"Forum targets: {len(forums)}")


if __name__ == '__main__':
    main()
