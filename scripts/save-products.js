// Helper script: node scripts/save-products.js <slug> '<products-json>'
const fs = require('fs');
const path = require('path');

const slug = process.argv[2];
const productsJson = process.argv[3];

if (!slug || !productsJson) {
  console.error('Usage: node scripts/save-products.js <slug> \'<products-json>\'');
  process.exit(1);
}

const filePath = path.join(__dirname, '..', 'content', 'pages', `${slug}.json`);

if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const products = JSON.parse(productsJson);

data.products = products;
fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log(`Updated ${slug}: ${products.length} products`);
