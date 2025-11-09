const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const { URL } = require('url');

const DB_PATH = path.join(__dirname, '..', 'db.json');
const OUT_DIR = path.join(__dirname, '..', 'src', 'assets', 'images');

function mkdirp(dir) {
  return fs.promises.mkdir(dir, { recursive: true });
}

function getExtFromUrl(u) {
  try {
    const p = new URL(u).pathname;
    const ext = path.extname(p).split('?')[0];
    if (ext && ext.length <= 6) return ext;
  } catch (e) {
    // ignore
  }
  return '.jpg';
}

function downloadUrl(url, dest, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > 5) return reject(new Error('Too many redirects'));
    const proto = url.startsWith('https') ? https : http;
    const req = proto.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const next = new URL(res.headers.location, url).toString();
        res.resume();
        return resolve(downloadUrl(next, dest, redirects + 1));
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => fileStream.close(() => resolve()));
      fileStream.on('error', (err) => reject(err));
    });
    req.on('error', reject);
  });
}

async function main() {
  console.log('Reading', DB_PATH);
  const raw = await fs.promises.readFile(DB_PATH, 'utf8');
  const db = JSON.parse(raw);

  await mkdirp(OUT_DIR);

  const vehicles = db.vehiculos || [];
  const summary = [];

  for (const v of vehicles) {
    if (!Array.isArray(v.images)) v.images = [];
    const newImages = [];
    for (let i = 0; i < v.images.length; i++) {
      const url = v.images[i];
      if (!url || typeof url !== 'string' || url.trim() === '') {
        newImages.push('assets/images/placeholder.jpg');
        continue;
      }
      const ext = getExtFromUrl(url) || '.jpg';
      const safeBrand = (v.brand || 'brand').toString().replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const safeModel = (v.model || 'model').toString().replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const filename = `vehicle-${v.id}-${i + 1}-${safeBrand}-${safeModel}${ext}`;
      const outPath = path.join(OUT_DIR, filename);
      const webPath = `assets/images/${filename}`;
      try {
        console.log(`Downloading ${url} -> ${outPath}`);
        await downloadUrl(url, outPath);
        console.log('  OK');
        newImages.push(webPath);
        summary.push({ id: v.id, url, file: webPath, ok: true });
      } catch (err) {
        console.error(`  Failed to download ${url}:`, err.message);
        // fallback: keep previous URL or placeholder
        const placeholder = 'assets/images/placeholder.jpg';
        newImages.push(placeholder);
        summary.push({ id: v.id, url, file: placeholder, ok: false, error: err.message });
      }
    }
    v.images = newImages;
  }

  // ensure there's a placeholder image
  const placeholderPath = path.join(OUT_DIR, 'placeholder.jpg');
  if (!fs.existsSync(placeholderPath)) {
    // create a tiny 1x1 gif as placeholder
    const buf = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
      'base64'
    );
    await fs.promises.writeFile(placeholderPath, buf);
    console.log('Wrote placeholder at', placeholderPath);
  }

  await fs.promises.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
  console.log('Updated db.json with local image paths.');
  console.log('Summary:', summary);
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
