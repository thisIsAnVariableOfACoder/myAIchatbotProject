const fs = require('fs');
const path = require('path');
const { buildCareerRecords } = require('../data/careerLibrary');

const careers = buildCareerRecords();

console.log(`Generating offlineStore.js with ${careers.length} careers...`);

const content = `
// GENERATED FROM careerLibrary.js - DO NOT EDIT MANUALLY
// Updated at: ${new Date().toISOString()}

export const API_BASE = (
  (typeof window !== 'undefined' && window.__API_BASE__) ||
  import.meta.env.VITE_API_BASE ||
  'http://localhost:5000'
);

// ... keeping existing state management code ...

// REPLACING HARDCODED CAREERS WITH DYNAMIC DATA
const BASE_CAREERS = ${JSON.stringify(careers.map(c => ({
    name: c.name,
    category: c.category,
    tags: c.required_skills || []
})), null, 2)};

const CAREERS = BASE_CAREERS;

// ... keeping the rest of the file ...
`;

console.log('Use this to regenerate the file content structure.');
