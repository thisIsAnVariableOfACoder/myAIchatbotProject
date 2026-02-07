const { buildCareerRecords } = require('../data/careerLibrary');

console.log('📊 Career Library Statistics\n');

const careers = buildCareerRecords();
console.log(`Total unique careers: ${careers.length}`);

// Count by category
const byCategory = {};
careers.forEach(c => {
    byCategory[c.category] = (byCategory[c.category] || 0) + 1;
});

console.log('\nBreakdown by category:');
Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
        console.log(`  ${cat}: ${count}`);
    });

console.log(`\n✅ Total: ${careers.length} careers`);
