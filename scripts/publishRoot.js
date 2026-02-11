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

function safeUnlink(target) {
  if (!fs.existsSync(target)) return;
  const stat = fs.lstatSync(target);
  if (stat.isDirectory()) {
    for (const entry of fs.readdirSync(target)) {
      safeUnlink(path.join(target, entry));
    }
    try {
      fs.rmdirSync(target);
    } catch {
      fs.rmSync(target, { recursive: true, force: true });
    }
    return;
  }
  fs.unlinkSync(target);
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

function syncDirectory(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });

  const sourceEntries = fs.readdirSync(srcDir);
  const sourceSet = new Set(sourceEntries);

  for (const entry of sourceEntries) {
    const srcPath = path.join(srcDir, entry);
    const destPath = path.join(destDir, entry);
    const srcStat = fs.statSync(srcPath);

    if (srcStat.isDirectory()) {
      syncDirectory(srcPath, destPath);
    } else {
      if (fs.existsSync(destPath) && fs.lstatSync(destPath).isDirectory()) {
        safeUnlink(destPath);
      }
      fs.copyFileSync(srcPath, destPath);
    }
  }

  for (const entry of fs.readdirSync(destDir)) {
    if (!sourceSet.has(entry)) {
      safeUnlink(path.join(destDir, entry));
    }
  }
}

for (const entry of fs.readdirSync(distDir)) {
  const srcPath = path.join(distDir, entry);
  const destPath = path.join(rootDir, entry);
  const srcStat = fs.statSync(srcPath);

  if (srcStat.isDirectory()) {
    if (fs.existsSync(destPath) && !fs.lstatSync(destPath).isDirectory()) {
      safeUnlink(destPath);
    }
    syncDirectory(srcPath, destPath);
  } else {
    if (fs.existsSync(destPath) && fs.lstatSync(destPath).isDirectory()) {
      safeUnlink(destPath);
    } else {
      removeIfExists(destPath);
    }
    copyItem(srcPath, destPath);
  }
}

console.log('Published frontend/dist to repository root.');
