const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, '../frontend/src/offlineStore.js');
let c = fs.readFileSync(p, 'utf8');

// Pattern to find the getIcon function
const startStr = '    // Map category to icon';
// We know exactly what the previous content looks like (with debug log)
// Or we can just find the start and end by brace counting or marker
const endMarker = "return 'default.svg';";
const closingBrace = "    };";

const startIndex = c.indexOf(startStr);
if (startIndex === -1) {
    console.error('Do not find start'); process.exit(1);
}
const endIndex = c.indexOf(closingBrace, startIndex);
if (endIndex === -1) {
    console.error('Do not find end'); process.exit(1);
}
const replaceEnd = endIndex + closingBrace.length;

const simpleLogic = `    // Map category to icon
    const getIcon = (cat) => {
      const key = normalizeText(cat || '').toLowerCase().trim();
      
      const MAPPING = {
        'agriculture': 'agri.svg',
        'beauty': 'service.svg',
        'business': 'business.svg',
        'construction': 'construction.svg',
        'data': 'tech.svg',
        'design': 'creative.svg',
        'education': 'education.svg',
        'engineering': 'engineering.svg',
        'finance': 'business.svg',
        'government': 'admin.svg',
        'healthcare': 'health.svg',
        'health': 'health.svg',
        'hospitality': 'hospitality.svg',
        'legal': 'legal.svg',
        'logistics': 'transport.svg',
        'marketing': 'business.svg',
        'media': 'creative.svg',
        'realestate': 'business.svg',
        'retail': 'service.svg',
        'science': 'science.svg',
        'sports': 'community.svg',
        'technology': 'tech.svg',
        'tech': 'tech.svg',
        'trades': 'engineering.svg',
        'transportation': 'transport.svg',
        'transport': 'transport.svg',
        'security': 'security.svg',
        'service': 'service.svg',
        'management': 'management.svg',
        'community': 'community.svg',
        'admin': 'admin.svg'
      };

      return MAPPING[key] || 'default.svg';
    };`;

const before = c.substring(0, startIndex);
const after = c.substring(replaceEnd);

fs.writeFileSync(p, before + simpleLogic + after, 'utf8');
console.log('Simplified getIcon logic');
