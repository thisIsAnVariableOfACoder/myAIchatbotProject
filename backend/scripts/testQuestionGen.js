const { generateAllQuestions } = require('../data/careerQuestionWeights');

console.log('📊 Generating Question Bank...\n');

const questions = generateAllQuestions();

console.log(`✅ Generated ${questions.length} questions`);

// Stats by category
const byCategory = {};
questions.forEach(q => {
    byCategory[q.category] = (byCategory[q.category] || 0) + 1;
});

console.log('\nQuestions by category:');
Object.entries(byCategory).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}`);
});

// Sample questions
console.log('\n📋 Sample questions (first 10):');
questions.slice(0, 10).forEach((q, idx) => {
    console.log(`\n${idx + 1}. ${q.text}`);
    console.log(`   ID: ${q.id}, Type: ${q.type}`);
    console.log(`   Careers: ${Object.keys(q.career_weights).slice(0, 3).join(', ')}...`);
});

// Check career coverage
const allCareersTargeted = new Set();
questions.forEach(q => {
    Object.keys(q.career_weights).forEach(c => allCareersTargeted.add(c));
});

console.log(`\n✅ Total unique careers targeted: ${allCareersTargeted.size}`);
console.log(`✅ Average questions per targeted career: ${(questions.length / allCareersTargeted.size).toFixed(1)}`);
