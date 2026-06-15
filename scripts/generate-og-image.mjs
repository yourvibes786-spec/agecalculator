import sharp from 'sharp';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(__dirname, '..', 'public', 'og-image.png');

const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fafafa"/>
      <stop offset="100%" stop-color="#f0f0f0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="0" width="1200" height="6" fill="#171717"/>
  <text x="80" y="140" font-family="system-ui, -apple-system, sans-serif" font-size="64" font-weight="800" letter-spacing="2" fill="#171717">AGE</text>
  <text x="80" y="220" font-family="system-ui, -apple-system, sans-serif" font-size="64" font-weight="300" letter-spacing="8" fill="#a3a3a3">CALCULATOR</text>
  <line x1="80" y1="270" x2="480" y2="270" stroke="#d4d4d4" stroke-width="2"/>
  <text x="80" y="340" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="500" fill="#525252">Calculate Exact Age Instantly</text>
  <text x="80" y="390" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="400" fill="#a3a3a3">Years \u00b7 Months \u00b7 Days \u00b7 Hours \u00b7 Minutes \u00b7 Seconds</text>
  <circle cx="1020" cy="315" r="180" fill="none" stroke="#e5e5e5" stroke-width="1.5"/>
  <text x="1020" y="300" font-family="system-ui, -apple-system, sans-serif" font-size="72" font-weight="700" fill="#171717" text-anchor="middle">25</text>
  <text x="1020" y="380" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="500" letter-spacing="3" fill="#a3a3a3" text-anchor="middle">YEARS OLD</text>
  <rect x="80" y="510" width="6" height="6" fill="#d4d4d4"/>
  <text x="100" y="520" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="400" fill="#a3a3a3">Privacy-First \u00b7 100% Free \u00b7 No Sign-Up</text>
  <rect x="0" y="624" width="1200" height="6" fill="#171717"/>
</svg>`;

sharp(Buffer.from(svg)).png().toFile(outputPath)
  .then(info => console.log('OG image created:', info))
  .catch(err => { console.error(err); process.exit(1); });
