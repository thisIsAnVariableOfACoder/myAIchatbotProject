const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'frontend', 'dist');

if (!fs.existsSync(distDir)) {
  console.error(`Missing ${distDir}. Run: npm --prefix frontend run build`);
  process.exit(1);
}

function removeIfExists(target) {
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
  }
}

function copyItem(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyItem(path.join(src, entry), path.join(dest, entry));
    }
    return;
  }
  fs.copyFileSync(src, dest);
}

for (const entry of fs.readdirSync(distDir)) {
  const srcPath = path.join(distDir, entry);
  const destPath = path.join(rootDir, entry);
  removeIfExists(destPath);
  copyItem(srcPath, destPath);
}

console.log('Published frontend/dist to repository root.');
