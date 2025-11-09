const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'db.json');
const OUT_DIR = path.join(__dirname, '..', 'src', 'assets', 'images');

function makeSafe(s) {
  return (s || '').toString().replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

function colorFromString(s) {
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = s.charCodeAt(i) + ((hash << 5) - hash);
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return '#' + '00000'.slice(0, 6 - c.length) + c;
}

async function mkdirp(dir) {
  return fs.promises.mkdir(dir, { recursive: true });
}

function makeSVG(brand, model, year, color) {
  const w = 1200;
  const h = 800;
  const title = `${brand} ${model}`;
  const subtitle = `${year}`;
  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>\n` +
    `<rect width='100%' height='100%' fill='${color}' />\n` +
    `<g fill='#ffffff' text-anchor='middle'>\n` +
    `<text x='50%' y='45%' font-family='Arial, Helvetica, sans-serif' font-size='72' font-weight='700'>${title}</text>\n` +
    `<text x='50%' y='58%' font-family='Arial, Helvetica, sans-serif' font-size='40' opacity='0.9'>${subtitle}</text>\n` +
    `</g>\n</svg>`;
}

async function main() {
  const raw = await fs.promises.readFile(DB_PATH, 'utf8');
  const db = JSON.parse(raw);
  await mkdirp(OUT_DIR);

  for (const v of db.vehiculos || []) {
    const brand = v.brand || 'auto';
    const model = v.model || '';
    const year = v.year || '';
    const safe = makeSafe(`${brand}-${model}`);
    const filename = `vehicle-${v.id}-${safe}.svg`;
    const outPath = path.join(OUT_DIR, filename);
    const color = colorFromString(brand + model).slice(0, 7);
    const svg = makeSVG(brand, model, year, color);
    await fs.promises.writeFile(outPath, svg, 'utf8');
    v.images = [`assets/images/${filename}`];
    console.log('Wrote', outPath);
  }

  await fs.promises.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
  console.log('Updated db.json to reference generated SVG placeholders.');
}

main().catch(err => { console.error(err); process.exit(1); });
