const sharp = require('sharp');
const path = require('path');

async function createAppleIcon() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">
      <rect width="180" height="180" fill="#000000"/>
      <text x="90" y="120" font-family="Arial, sans-serif" font-size="120" font-weight="bold" fill="#FF9000" text-anchor="middle">J</text>
    </svg>
  `;

  const outputPath = path.join(__dirname, '..', 'public', 'apple-touch-icon.png');
  
  await sharp(Buffer.from(svg))
    .resize(180, 180)
    .png()
    .toFile(outputPath);

  console.log('✅ apple-touch-icon.png created successfully!');
}

createAppleIcon().catch(console.error);
