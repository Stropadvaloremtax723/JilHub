const fs = require('fs');
const path = require('path');

// Create a simple ICO file (16x16 black square with orange J)
// This is a minimal valid ICO file structure
const icoHeader = Buffer.from([
  0x00, 0x00, // Reserved
  0x01, 0x00, // Type (1 = ICO)
  0x01, 0x00, // Number of images
]);

const icoDir = Buffer.from([
  0x10, // Width (16)
  0x10, // Height (16)
  0x00, // Color palette
  0x00, // Reserved
  0x01, 0x00, // Color planes
  0x20, 0x00, // Bits per pixel (32)
  0x00, 0x04, 0x00, 0x00, // Size of image data
  0x16, 0x00, 0x00, 0x00, // Offset to image data
]);

// Simple 16x16 RGBA bitmap (black background, orange J in center)
const pixels = [];
for (let y = 0; y < 16; y++) {
  for (let x = 0; x < 16; x++) {
    // Create a simple "J" pattern
    const isJ = (x >= 6 && x <= 9 && y >= 4 && y <= 12) || 
                (x >= 4 && x <= 6 && y >= 10 && y <= 12);
    
    if (isJ) {
      pixels.push(0x00, 0x90, 0xFF, 0xFF); // Orange (BGRA format)
    } else {
      pixels.push(0x00, 0x00, 0x00, 0xFF); // Black (BGRA format)
    }
  }
}

const bmpHeader = Buffer.from([
  0x28, 0x00, 0x00, 0x00, // Header size
  0x10, 0x00, 0x00, 0x00, // Width
  0x20, 0x00, 0x00, 0x00, // Height (doubled for ICO)
  0x01, 0x00, // Planes
  0x20, 0x00, // Bits per pixel
  0x00, 0x00, 0x00, 0x00, // Compression
  0x00, 0x04, 0x00, 0x00, // Image size
  0x00, 0x00, 0x00, 0x00, // X pixels per meter
  0x00, 0x00, 0x00, 0x00, // Y pixels per meter
  0x00, 0x00, 0x00, 0x00, // Colors used
  0x00, 0x00, 0x00, 0x00, // Important colors
]);

const imageData = Buffer.concat([bmpHeader, Buffer.from(pixels)]);
const icoFile = Buffer.concat([icoHeader, icoDir, imageData]);

const publicPath = path.join(__dirname, '..', 'public', 'favicon.ico');
fs.writeFileSync(publicPath, icoFile);

console.log('✅ favicon.ico created successfully!');
