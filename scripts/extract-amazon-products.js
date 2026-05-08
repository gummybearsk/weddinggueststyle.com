const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '..', 'content', 'pages');
const PROGRESS_FILE = '/tmp/amazon-extract-progress.json';

// All slugs that need products
const ALL_SLUGS = fs.readdirSync(CONTENT_DIR)
  .filter(f => f.endsWith('.json'))
  .map(f => {
    const data = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, f), 'utf8'));
    return { slug: data.slug, productCount: data.products ? data.products.length : 0 };
  })
  .filter(s => s.productCount === 0)
  .map(s => s.slug);

// Map slug to Amazon search term
function slugToSearch(slug) {
  return slug.replace(/-/g, ' ');
}

// Load progress
function loadProgress() {
  if (fs.existsSync(PROGRESS_FILE)) {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
  }
  return { completed: [], failed: [] };
}

function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

async function extractProducts(page) {
  return await page.evaluate(() => {
    const results = [];
    const items = document.querySelectorAll('[data-component-type="s-search-result"]');
    items.forEach(item => {
      const asin = item.getAttribute('data-asin');
      if (!asin) return;
      const img = item.querySelector('img.s-image');
      const title = img ? img.alt : '';
      let image = img ? img.src : '';
      if (image) image = image.replace(/_AC_[^.]+\./, '_AC_UL500_.');
      const priceEl = item.querySelector('.a-price .a-offscreen');
      const price = priceEl ? priceEl.textContent.trim() : '';
      const ratingEl = item.querySelector('[aria-label*="out of 5 stars"]');
      let rating = 0;
      if (ratingEl) {
        const m = ratingEl.getAttribute('aria-label').match(/([\d.]+)\s*out/);
        if (m) rating = parseFloat(m[1]);
      }
      const reviewEl = item.querySelector('[aria-label*="ratings"]');
      let reviewCount = 0;
      if (reviewEl) {
        const text = reviewEl.textContent.replace(/,/g, '');
        const m2 = text.match(/(\d+)/);
        if (m2) reviewCount = parseInt(m2[1]);
      }
      if (rating >= 4.0 && reviewCount >= 15 && price && title) {
        results.push({ title, image, url: `https://www.amazon.com/dp/${asin}?tag=values0d4-20`, price, rating, reviewCount });
      }
    });
    return results.slice(0, 15);
  });
}

function saveProducts(slug, products) {
  const filePath = path.join(CONTENT_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) {
    console.log(`  SKIP: File not found for ${slug}`);
    return false;
  }
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  data.products = products;
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  return true;
}

(async () => {
  const progress = loadProgress();
  const remaining = ALL_SLUGS.filter(s => !progress.completed.includes(s));

  console.log(`\n=== Amazon Product Extraction ===`);
  console.log(`Total empty pages: ${ALL_SLUGS.length}`);
  console.log(`Already completed: ${progress.completed.length}`);
  console.log(`Remaining: ${remaining.length}\n`);

  if (remaining.length === 0) {
    console.log('All pages have been processed!');
    return;
  }

  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled']
  });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  for (let i = 0; i < remaining.length; i++) {
    const slug = remaining[i];
    const searchTerm = slugToSearch(slug);
    console.log(`[${i+1}/${remaining.length}] ${slug} → "${searchTerm}"`);

    try {
      const url = `https://www.amazon.com/s?k=${encodeURIComponent(searchTerm)}`;
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });

      // Wait for search results
      await page.waitForSelector('[data-component-type="s-search-result"]', { timeout: 10000 });
      await page.waitForTimeout(1500); // Let images load

      const products = await extractProducts(page);

      if (products.length > 0) {
        saveProducts(slug, products);
        progress.completed.push(slug);
        console.log(`  ✅ ${products.length} products saved`);
      } else {
        console.log(`  ⚠️  0 qualifying products found, trying broader search...`);
        // Try a simpler search
        const simpler = searchTerm.replace('wedding guest ', '').replace('dresses', 'dress');
        const url2 = `https://www.amazon.com/s?k=${encodeURIComponent(searchTerm + ' women')}`;
        await page.goto(url2, { waitUntil: 'domcontentloaded', timeout: 20000 });
        await page.waitForSelector('[data-component-type="s-search-result"]', { timeout: 10000 });
        await page.waitForTimeout(1500);

        const products2 = await extractProducts(page);
        if (products2.length > 0) {
          saveProducts(slug, products2);
          progress.completed.push(slug);
          console.log(`  ✅ ${products2.length} products saved (broader search)`);
        } else {
          progress.failed.push(slug);
          console.log(`  ❌ No products found`);
        }
      }

      saveProgress(progress);

      // Rate limiting - random delay
      const delay = 2000 + Math.random() * 2000;
      await page.waitForTimeout(delay);

    } catch (err) {
      console.log(`  ❌ Error: ${err.message}`);
      progress.failed.push(slug);
      saveProgress(progress);

      // Check for CAPTCHA
      const content = await page.content();
      if (content.includes('captcha') || content.includes('CAPTCHA') || content.includes('Type the characters')) {
        console.log('  🔒 CAPTCHA detected! Waiting 30s...');
        await page.waitForTimeout(30000);
      }
    }
  }

  console.log(`\n=== Done! ===`);
  console.log(`Completed: ${progress.completed.length}`);
  console.log(`Failed: ${progress.failed.length}`);
  if (progress.failed.length > 0) {
    console.log(`Failed slugs: ${progress.failed.join(', ')}`);
  }

  await browser.close();
})();
