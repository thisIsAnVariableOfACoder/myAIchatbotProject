/**
 * Test script for keyword-based career scoring
 */

const {
  normalizeAnswer,
  extractCareerKeywords,
  calculateCareerScoresFromAnswers
} = require('../services/questionEngine');

console.log('=== Testing Keyword Extraction ===\n');

// Test 1: Design-focused answer
const designAnswer = 'tôi thích mỹ thuật và muốn theo thiết kế đồ họa';
const normalizedDesign = normalizeAnswer(designAnswer);
console.log('Input:', designAnswer);
console.log('Normalized:', normalizedDesign);

try {
  const parsed = JSON.parse(normalizedDesign);
  console.log('Intent:', parsed.intent);
  console.log('Keywords:', parsed.keywords);
} catch (e) {
  console.log('Not a JSON string');
}

console.log('\n---\n');

// Test 2: Tech-focused answer
const techAnswer = 'tôi thích lập trình và muốn làm phần mềm';
const normalizedTech = normalizeAnswer(techAnswer);
console.log('Input:', techAnswer);
console.log('Normalized:', normalizedTech);

try {
  const parsed = JSON.parse(normalizedTech);
  console.log('Intent:', parsed.intent);
  console.log('Keywords:', parsed.keywords);
} catch (e) {
  console.log('Not a JSON string');
}

console.log('\n---\n');

// Test 3: Negative answer
const negativeAnswer = 'tôi không thích làm việc với máy tính';
const normalizedNegative = normalizeAnswer(negativeAnswer);
console.log('Input:', negativeAnswer);
console.log('Normalized:', normalizedNegative);

try {
  const parsed = JSON.parse(normalizedNegative);
  console.log('Intent:', parsed.intent);
  console.log('Keywords:', parsed.keywords);
} catch (e) {
  console.log('Not a JSON string');
}

console.log('\n=== Testing Keyword Extraction Function ===\n');

const testText = 'tôi thích mỹ thuật và muốn theo thiết kế đồ họa';
const keywords = extractCareerKeywords(testText);
console.log('Text:', testText);
console.log('Extracted Keywords:', keywords);

console.log('\n=== Test Complete ===');