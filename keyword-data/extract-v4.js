/**
 * Keyword Detail Extraction v4 - Auto-detect ALL 100 keywords from page 1
 * Phase 1: Collect all keyword names from page 1 (scrolling to load all 100)
 * Phase 2: Click into each keyword for detailed data
 */

const { chromium } = require('/Users/raymond/.claude/skills/backlink-research/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = '/tmp/wedding-keywords';
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function parseDetailPage(page, keyword) {
  console.log(`\n--- Parsing: "${keyword}" ---`);

  await sleep(4000);
  await page.waitForFunction(() => {
    return document.body && document.body.innerText.length > 2000;
  }, { timeout: 30000 }).catch(() => {});
  await sleep(2000);

  const data = await page.evaluate(() => {
    const text = document.body?.innerText || '';
    const result = {
      volume: '',
      kd: '',
      kdDifficulty: '',
      intent: '',
      cpc: '',
      competition: '',
      keywordVariations: [],
      questions: [],
      keywordStrategy: [],
      serpCompetitors: [],
      fullText: text.substring(0, 25000),
    };

    const volMatch = text.match(/搜索量\n([\d,.]+K?)/);
    if (volMatch) result.volume = volMatch[1];

    const kdMatch = text.match(/关键词难度\n(\d+%)/);
    if (kdMatch) result.kd = kdMatch[1];

    const kdLevelMatch = text.match(/(\d+%)\n(容易|困难|可能|非常困难|很难)/);
    if (kdLevelMatch) result.kdDifficulty = kdLevelMatch[2];

    const intentMatch = text.match(/意图\n([^\n]+)/);
    if (intentMatch) result.intent = intentMatch[1];

    const cpcMatch = text.match(/CPC\n\$([\d.]+)/);
    if (cpcMatch) result.cpc = '$' + cpcMatch[1];

    const compMatch = text.match(/竞争激烈程度\n([\d.]+)/);
    if (compMatch) result.competition = compMatch[1];

    const varSection = text.match(/关键词变化[\s\S]*?关键词\n搜索量\nKD \(%\)([\s\S]*?)查看全部/);
    if (varSection) {
      const lines = varSection[1].trim().split('\n');
      for (let i = 0; i < lines.length - 2; i += 3) {
        const kw = lines[i]?.trim();
        const vol = lines[i+1]?.trim();
        const kd = lines[i+2]?.trim();
        if (kw && vol && !kw.includes('关键词')) {
          result.keywordVariations.push({ keyword: kw, volume: vol, kd: kd });
        }
      }
    }

    const qSection = text.match(/问题[\s\S]*?总搜索量[\s\S]*?关键词\n搜索量\nKD \(%\)([\s\S]*?)查看全部/);
    if (qSection) {
      const lines = qSection[1].trim().split('\n');
      for (let i = 0; i < lines.length - 2; i += 3) {
        const q = lines[i]?.trim();
        const vol = lines[i+1]?.trim();
        const kd = lines[i+2]?.trim();
        if (q && vol && !q.includes('关键词')) {
          result.questions.push({ question: q, volume: vol, kd: kd });
        }
      }
    }

    const stratSection = text.match(/关键词策略[\s\S]*?自动获取[\s\S]*?\n([\s\S]*?)超越竞争对手/);
    if (stratSection) {
      const lines = stratSection[1].trim().split('\n');
      for (const line of lines) {
        if (line.trim() && !line.includes('查看')) {
          result.keywordStrategy.push(line.trim());
        }
      }
    }

    const serpSection = text.match(/超越竞争对手[\s\S]*?域名\n可读性分数\n字符统计\n加载时间\n可排序\n([\s\S]*?)查看机会/);
    if (serpSection) {
      const lines = serpSection[1].trim().split('\n');
      for (let i = 0; i < lines.length - 3; i += 4) {
        const domain = lines[i]?.trim();
        const readability = lines[i+1]?.trim();
        const charCount = lines[i+2]?.trim();
        const loadTime = lines[i+3]?.trim();
        if (domain && domain.includes('.')) {
          result.serpCompetitors.push({ domain, readability, charCount, loadTime });
        }
      }
    }

    return result;
  });

  data.keyword = keyword;
  console.log(`   Volume: ${data.volume}, KD: ${data.kd}, Intent: ${data.intent}`);
  console.log(`   Variations: ${data.keywordVariations.length}, Questions: ${data.questions.length}`);
  console.log(`   SERP competitors: ${data.serpCompetitors.length}`);
  return data;
}

async function main() {
  console.log('=== Keyword Detail Extraction v4 (All 100 from page 1) ===\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--disable-blink-features=AutomationControlled', '--no-first-run', '--no-default-browser-check']
  });

  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  let seoPage = null;
  context.on('page', (p) => {
    const url = p.url();
    console.log(`>>> New page: ${url.substring(0, 80)}`);
    if (url.includes('sem.3ue.co')) seoPage = p;
  });

  const page = await context.newPage();
  page.setDefaultTimeout(90000);

  try {
    // Step 1: Login
    console.log('Step 1: Login...');
    await page.goto('https://dash.3ue.co/zh-Hans/#/login');
    await sleep(3000);
    await page.fill('input[type="text"], input:first-of-type', 'STGG');
    await page.fill('input[type="password"]', 'STG123');
    await page.click('button:has-text("登录")');
    await page.waitForSelector('text=打开', { timeout: 30000 }).catch(() => {});
    await sleep(3000);
    console.log('   Logged in!\n');

    // Step 2: Select node 4-25
    console.log('Step 2: Select node...');
    const nodeBtn = await page.$('button:has-text("节点")');
    if (nodeBtn) {
      const nodeText = await nodeBtn.textContent();
      console.log(`   Current: ${nodeText.substring(0, 60)}`);

      const goodNode = /节点([4-9]|1\d|2[0-5])\b/.test(nodeText) && nodeText.includes('倍率 X 1 ') && nodeText.includes('✅');
      if (!goodNode) {
        await nodeBtn.click();
        await sleep(2000);
        const options = await page.$$('[class*="option"], [role="option"], li, div');
        let found = false;
        for (const opt of options) {
          const t = await opt.textContent().catch(() => '');
          const vis = await opt.isVisible().catch(() => false);
          if (vis && /节点([4-9]|1\d|2[0-5])\b/.test(t) && t.includes('倍率 X 1 ') && t.includes('✅')) {
            console.log(`   Selecting: ${t.substring(0, 60)}`);
            await opt.click({ force: true });
            found = true;
            await sleep(2000);
            break;
          }
        }
        if (!found) {
          for (const opt of options) {
            const t = await opt.textContent().catch(() => '');
            const vis = await opt.isVisible().catch(() => false);
            if (vis && /节点([4-9]|1\d|2[0-5])\b/.test(t) && t.includes('✅')) {
              console.log(`   Selecting (higher cost): ${t.substring(0, 60)}`);
              await opt.click({ force: true });
              await sleep(2000);
              break;
            }
          }
        }
        await page.keyboard.press('Escape');
        await sleep(1000);
      }
    }

    // Step 3: Click 打开
    console.log('\nStep 3: Open SEMrush...');
    await page.click('button:has-text("打开")', { force: true });

    for (let i = 0; i < 180; i++) {
      await sleep(1000);
      for (const p of context.pages()) {
        if (p.url().includes('sem.3ue.co')) {
          const ok = await p.evaluate(() => document.body?.innerHTML?.length > 5000).catch(() => false);
          if (ok) { seoPage = p; break; }
        }
      }
      if (seoPage) break;
      if (i % 15 === 0 && i > 0) console.log(`   Waiting... ${i}s`);
    }

    if (!seoPage) { console.log('ERROR: No SEO page'); await browser.close(); return; }
    await seoPage.bringToFront();
    await sleep(5000);
    console.log('   SEMrush opened!\n');

    // Step 4: Keyword magic
    console.log('Step 4: Keyword magic...');
    const magicUrl = 'https://sem.3ue.co/analytics/keywordmagic/?q=wedding+guest+dresses&db=us';
    await seoPage.goto(magicUrl, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await sleep(10000);
    await seoPage.waitForFunction(() => document.body?.innerText?.includes('wedding guest dresses'), { timeout: 30000 }).catch(() => {});
    await sleep(3000);

    // Change to show 100 results per page if not already
    // First, try to set rows to 100
    const setTo100 = await seoPage.evaluate(() => {
      // Look for a dropdown/selector for rows per page
      const selects = document.querySelectorAll('select');
      for (const sel of selects) {
        const opts = sel.querySelectorAll('option');
        for (const opt of opts) {
          if (opt.value === '100' || opt.textContent.includes('100')) {
            sel.value = opt.value;
            sel.dispatchEvent(new Event('change', { bubbles: true }));
            return 'set to 100';
          }
        }
      }
      // Look for a "100" button in pagination area
      const btns = document.querySelectorAll('button, [role="button"]');
      for (const btn of btns) {
        if (btn.textContent?.trim() === '100') {
          btn.click();
          return 'clicked 100 button';
        }
      }
      return 'not found';
    });
    console.log(`   Rows per page: ${setTo100}`);
    await sleep(5000);

    // Step 5: Auto-detect ALL keywords from page 1
    console.log('\nStep 5: Collecting all keyword names from page 1...');

    // Scroll to load all rows
    for (let i = 0; i < 10; i++) {
      await seoPage.evaluate(() => window.scrollBy(0, 1000));
      await sleep(1000);
    }
    await seoPage.evaluate(() => window.scrollTo(0, 0));
    await sleep(2000);

    // Collect all keyword links from the table
    const detectedKeywords = await seoPage.evaluate(() => {
      const keywords = [];
      const seen = new Set();

      // Method 1: Find links that point to keywordoverview
      const links = document.querySelectorAll('a[href*="keywordoverview"]');
      for (const link of links) {
        const text = link.innerText?.trim()?.toLowerCase();
        if (text && text.length > 3 && text.length < 100 && !seen.has(text) && !text.includes('\n')) {
          seen.add(text);
          keywords.push(text);
        }
      }

      // Method 2: If method 1 didn't find enough, try broader approach
      if (keywords.length < 20) {
        const allLinks = document.querySelectorAll('a');
        for (const link of allLinks) {
          const text = link.innerText?.trim()?.toLowerCase();
          const href = link.href || '';
          if (text && text.length > 5 && text.length < 80 &&
              !seen.has(text) && !text.includes('\n') &&
              text.includes('wedding') && text.includes('guest') &&
              !text.includes('http')) {
            seen.add(text);
            keywords.push(text);
          }
        }
      }

      return keywords;
    });

    console.log(`   Detected ${detectedKeywords.length} keywords`);

    // If we didn't get enough, try scrolling more and re-collecting
    if (detectedKeywords.length < 50) {
      console.log('   Scrolling for more keywords...');
      for (let i = 0; i < 20; i++) {
        await seoPage.evaluate(() => window.scrollBy(0, 500));
        await sleep(500);
      }
      await sleep(3000);

      const moreKeywords = await seoPage.evaluate((existing) => {
        const keywords = [];
        const seen = new Set(existing);
        const links = document.querySelectorAll('a');
        for (const link of links) {
          const text = link.innerText?.trim()?.toLowerCase();
          if (text && text.length > 5 && text.length < 80 &&
              !seen.has(text) && !text.includes('\n') &&
              (text.includes('wedding') || text.includes('dress') || text.includes('guest'))) {
            seen.add(text);
            keywords.push(text);
          }
        }
        return keywords;
      }, detectedKeywords);

      detectedKeywords.push(...moreKeywords);
      console.log(`   Total after scroll: ${detectedKeywords.length} keywords`);
    }

    // Save keyword list
    fs.writeFileSync(path.join(OUTPUT_DIR, 'PAGE1_KEYWORDS.json'), JSON.stringify(detectedKeywords, null, 2));
    console.log(`   Saved keyword list to PAGE1_KEYWORDS.json\n`);

    // Log all keywords
    detectedKeywords.forEach((kw, i) => console.log(`   ${i+1}. ${kw}`));
    console.log('');

    // Step 6: Extract details for each keyword
    console.log('Step 6: Extracting keyword details...\n');

    // Load existing results if available (for resuming)
    let allResults = {};
    const combinedPath = path.join(OUTPUT_DIR, 'ALL_KEYWORD_DETAILS.json');
    if (fs.existsSync(combinedPath)) {
      try {
        allResults = JSON.parse(fs.readFileSync(combinedPath, 'utf-8'));
        console.log(`   Resuming: ${Object.keys(allResults).length} already extracted\n`);
      } catch(e) {}
    }

    let count = Object.keys(allResults).length;
    let skipCount = 0;
    let newCount = 0;

    for (const kw of detectedKeywords) {
      // Skip already extracted
      if (allResults[kw]) {
        console.log(`   SKIP (already done): "${kw}"`);
        continue;
      }

      try {
        // Ensure we're on keyword magic page
        if (!seoPage.url().includes('keywordmagic')) {
          await seoPage.goto(magicUrl, { timeout: 60000, waitUntil: 'domcontentloaded' });
          await sleep(8000);
          await seoPage.waitForFunction(() => document.body?.innerText?.length > 5000, { timeout: 30000 }).catch(() => {});
          await sleep(3000);
        }

        // Find and click keyword link
        const clicked = await seoPage.evaluate((kw) => {
          const links = document.querySelectorAll('a');
          for (const link of links) {
            const t = link.innerText?.trim()?.toLowerCase();
            if (t === kw.toLowerCase()) { link.click(); return true; }
          }
          window.scrollTo(0, document.body.scrollHeight / 2);
          return false;
        }, kw);

        if (!clicked) {
          await sleep(2000);
          // Try after scroll
          const clicked2 = await seoPage.evaluate((kw) => {
            const links = document.querySelectorAll('a');
            for (const link of links) {
              const t = link.innerText?.trim()?.toLowerCase();
              if (t === kw.toLowerCase() || (t && t.includes(kw.toLowerCase()) && t.length < kw.length + 10)) {
                link.click(); return true;
              }
            }
            // Scroll down more
            window.scrollBy(0, 1000);
            return false;
          }, kw);

          if (!clicked2) {
            await sleep(2000);
            // One more try after more scrolling
            const clicked3 = await seoPage.evaluate((kw) => {
              const links = document.querySelectorAll('a');
              for (const link of links) {
                const t = link.innerText?.trim()?.toLowerCase();
                if (t === kw.toLowerCase()) { link.click(); return true; }
              }
              return false;
            }, kw);

            if (!clicked3) {
              console.log(`   SKIP: "${kw}" not found`);
              skipCount++;
              continue;
            }
          }
        }

        await sleep(5000);

        let detailPage = seoPage;
        for (const p of context.pages()) {
          if (p.url().includes('keywordoverview') && p !== seoPage) {
            detailPage = p;
            await detailPage.bringToFront();
            await sleep(3000);
            break;
          }
        }
        if (seoPage.url().includes('keywordoverview')) detailPage = seoPage;

        const data = await parseDetailPage(detailPage, kw);
        allResults[kw] = data;

        const safeName = kw.replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
        fs.writeFileSync(path.join(OUTPUT_DIR, `detail_${safeName}.json`), JSON.stringify(data, null, 2));
        fs.writeFileSync(combinedPath, JSON.stringify(allResults, null, 2));

        count++;
        newCount++;
        console.log(`   SAVED (${count} total, ${newCount} new)\n`);

        if (detailPage !== seoPage) {
          await detailPage.close();
        } else {
          await seoPage.goBack({ timeout: 15000 }).catch(async () => {
            await seoPage.goto(magicUrl, { timeout: 60000, waitUntil: 'domcontentloaded' });
          });
          await sleep(5000);
        }

      } catch (err) {
        console.error(`   ERROR: "${kw}": ${err.message}`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`DONE: ${count} total extracted (${newCount} new), ${skipCount} skipped`);
    console.log(`Output: ${combinedPath}`);
    console.log('='.repeat(60));

  } catch (err) {
    console.error('Fatal:', err.message);
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
