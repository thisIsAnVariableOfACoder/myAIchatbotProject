const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '../frontend/src/offlineStore.js'), 'utf8');
const regex = /"category":\s*"([^"]+)"/g;
let match;
const categories = new Set();

while ((match = regex.exec(content)) !== null) {
    categories.add(match[1]);
}

console.log('Unique Categories:', Array.from(categories).sort());
