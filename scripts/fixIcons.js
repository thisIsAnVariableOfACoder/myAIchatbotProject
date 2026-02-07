const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, '../frontend/src/offlineStore.js');
let c = fs.readFileSync(p, 'utf8');

// Pattern to find the getIcon function start
const startStr = '    // Map category to icon';
// Pattern to find the getIcon function end (look for the return default and closing brace)
// Based on Step 915 view
const endMarker = "return 'default.svg';";
const closingBrace = "    };";

const startIndex = c.indexOf(startStr);
if (startIndex === -1) {
    console.error('Could not find start of getIcon');
    process.exit(1);
}

// Find the closing brace AFTER the start 
const endIndex = c.indexOf(closingBrace, startIndex);

if (endIndex === -1) {
    console.error('Could not find end of getIcon');
    process.exit(1);
}

// Calculate the exact end include the closing brace length
const replaceEnd = endIndex + closingBrace.length;

const newLogic = `    // Map category to icon
    const getIcon = (cat) => {
      const lower = normalizeText(cat || '').toLowerCase();
      
      // Explicit English Mapping (High Priority)
      if (lower.includes('technology') || lower.includes('data') || lower.includes('it')) return 'tech.svg';
      if (lower.includes('education')) return 'education.svg';
      if (lower.includes('health') || lower.includes('medical') || lower.includes('doctor')) return 'health.svg';
      if (lower.includes('business') || lower.includes('finance') || lower.includes('marketing') || lower.includes('sales')) return 'business.svg';
      if (lower.includes('creative') || lower.includes('design') || lower.includes('art') || lower.includes('media')) return 'creative.svg';
      if (lower.includes('science')) return 'science.svg';
      if (lower.includes('security')) return 'security.svg';
      if (lower.includes('service') || lower.includes('beauty') || lower.includes('retail')) return 'service.svg';
      if (lower.includes('hospitality') || lower.includes('hotel') || lower.includes('tourism')) return 'hospitality.svg';
      if (lower.includes('transport') || lower.includes('logistics')) return 'transport.svg';
      if (lower.includes('construction') || lower.includes('architecture')) return 'construction.svg';
      if (lower.includes('agriculture') || lower.includes('farming') || lower.includes('agri')) return 'agri.svg';
      if (lower.includes('management') || lower.includes('manager')) return 'management.svg';
      if (lower.includes('legal') || lower.includes('law')) return 'legal.svg';
      if (lower.includes('admin') || lower.includes('government') || lower.includes('office')) return 'admin.svg';
      if (lower.includes('community') || lower.includes('social') || lower.includes('sports')) return 'community.svg';
      if (lower.includes('engineering') || lower.includes('industry') || lower.includes('technical') || lower.includes('trades')) return 'engineering.svg';

      // Vietnamese Mapping (Fallback)
      if (lower.includes('cong nghe')) return 'tech.svg';
      if (lower.includes('giao duc')) return 'education.svg';
      if (lower.includes('y te') || lower.includes('bac si')) return 'health.svg';
      if (lower.includes('kinh doanh')) return 'business.svg';
      if (lower.includes('nghe thuat') || lower.includes('thiet ke')) return 'creative.svg';
      if (lower.includes('khoa hoc')) return 'science.svg';
      if (lower.includes('an ninh')) return 'security.svg';
      if (lower.includes('dich vu')) return 'service.svg';
      if (lower.includes('du lich')) return 'hospitality.svg';
      if (lower.includes('van tai')) return 'transport.svg';
      if (lower.includes('xay dung')) return 'construction.svg';
      if (lower.includes('nong nghiep')) return 'agri.svg';
      if (lower.includes('quan ly')) return 'management.svg';
      if (lower.includes('luat')) return 'legal.svg';
      if (lower.includes('hanh chinh')) return 'admin.svg';
      if (lower.includes('cong dong')) return 'community.svg';
      if (lower.includes('ky thuat') || lower.includes('co khi')) return 'engineering.svg';

      return 'default.svg';
    };`;

const before = c.substring(0, startIndex);
const after = c.substring(replaceEnd);

fs.writeFileSync(p, before + newLogic + after, 'utf8');
console.log('Successfully updated getIcon logic in offlineStore.js');
