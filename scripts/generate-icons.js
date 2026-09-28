import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPng(width, height, drawFn) {
  // Color type 6 = RGBA (4 bytes per pixel)
  const bytesPerPixel = 4;
  const scanlineLength = width * bytesPerPixel + 1; // +1 for filter byte
  const rawData = Buffer.alloc(height * scanlineLength);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * bytesPerPixel;
      const [r, g, b, a] = drawFn(x, y, width, height);
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  // Compress IDAT
  const compressed = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth
  ihdrData[9] = 6; // Color type (RGBA)
  ihdrData[10] = 0; // Compression
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace

  function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(8 + len + 4);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, 'ascii');
    data.copy(buf, 8);
    const crc = crc32(buf.subarray(4, 8 + len));
    buf.writeUInt32BE(crc, 8 + len);
    return buf;
  }

  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i];
      for (let j = 0; j < 8; j++) {
        c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
      }
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  const ihdrChunk = makeChunk('IHDR', ihdrData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// FlowGuard Icon Drawing: Dark Slate background, Emerald glowing shield with KSh / Currency glyph
function drawFlowGuardIcon(x, y, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const radius = w * 0.44;

  // Background: Rounded slate background
  const cornerR = w * 0.22;
  const inBox = (
    Math.abs(dx) <= (w/2 - cornerR) || Math.abs(dy) <= (h/2 - cornerR) ||
    Math.hypot(Math.abs(dx) - (w/2 - cornerR), Math.abs(dy) - (h/2 - cornerR)) <= cornerR
  );

  if (!inBox) {
    return [0, 0, 0, 0]; // Transparent outside icon bounds
  }

  // Inner Slate Background
  let r = 15, g = 23, b = 42, a = 255; // #0f172a

  // Emerald Circular Glow
  if (dist < radius) {
    const glowFactor = 1 - (dist / radius);
    r = Math.floor(r + (16 - r) * glowFactor * 0.7);
    g = Math.floor(g + (185 - g) * glowFactor * 0.7);
    b = Math.floor(b + (129 - b) * glowFactor * 0.7);
  }

  // Shield Geometry
  const nx = (x - cx) / (w * 0.3);
  const ny = (y - cy) / (h * 0.35);

  const inShield = (
    Math.abs(nx) <= 1.0 &&
    ny >= -0.9 &&
    ny <= 1.0 - Math.abs(nx) * 0.6 &&
    (ny <= 0.2 || Math.hypot(nx, ny - 0.2) <= 1.1)
  );

  if (inShield) {
    // Shield Gradient
    r = 16;
    g = 185;
    b = 129; // Emerald #10b981
    
    // Shield border highlight
    if (Math.abs(nx) > 0.85 || ny < -0.75 || (ny > 0.6 && ny > 0.8 - Math.abs(nx) * 0.6)) {
      r = 52;
      g = 211;
      b = 153; // Emerald-400
    }

    // Inner symbol (FlowGuard 'F' + '$' / Currency Cross)
    const isCenterBar = Math.abs(nx) < 0.22 && ny > -0.6 && ny < 0.6;
    const isTopBar = ny > -0.6 && ny < -0.35 && nx > -0.22 && nx < 0.65;
    const isMidBar = ny > -0.15 && ny < 0.1 && nx > -0.22 && nx < 0.5;

    if (isCenterBar || isTopBar || isMidBar) {
      r = 255;
      g = 255;
      b = 255; // Crisp White
    }
  }

  return [r, g, b, a];
}

const iconsDir = path.resolve('public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

console.log('Generating FlowGuard PWA icons...');

const png192 = createPng(192, 192, drawFlowGuardIcon);
fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), png192);
console.log('✓ Created icon-192.png');

const png512 = createPng(512, 512, drawFlowGuardIcon);
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), png512);
console.log('✓ Created icon-512.png');

const pngApple = createPng(180, 180, drawFlowGuardIcon);
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), pngApple);
console.log('✓ Created apple-touch-icon.png');

// Also write favicon & SVG icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <rect width="512" height="512" rx="128" fill="#0f172a"/>
  <circle cx="256" cy="256" r="210" fill="url(#emerald_glow)" opacity="0.4"/>
  <path d="M256 64L384 128V240C384 340 330 416 256 448C182 416 128 340 128 240V128L256 64Z" fill="#10b981" stroke="#34d399" stroke-width="14"/>
  <path d="M224 160H310M224 230H290M224 160V340" stroke="#ffffff" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/>
  <defs>
    <radialGradient id="emerald_glow" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0"/>
    </radialGradient>
  </defs>
</svg>`;

fs.writeFileSync(path.join(iconsDir, 'icon.svg'), svgContent);
fs.writeFileSync(path.resolve('public/favicon.svg'), svgContent);
console.log('✓ Created SVG & Favicons');
