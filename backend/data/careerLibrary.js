const CATEGORY_SKILLS = {
  Technology: ['coding', 'problem_solving', 'sql'],
  Data: ['statistics', 'sql', 'python'],
  Design: ['design', 'creativity', 'user_research'],
  Business: ['communication', 'analysis', 'management'],
  Marketing: ['communication', 'creativity', 'analytics'],
  Finance: ['analysis', 'excel', 'finance'],
  Education: ['teaching', 'communication', 'subject_knowledge'],
  Healthcare: ['care', 'communication', 'medical'],
  Engineering: ['math', 'physics', 'design'],
  Legal: ['writing', 'analysis', 'research'],
  Hospitality: ['service', 'communication', 'organization'],
  Logistics: ['analysis', 'process', 'organization'],
  Media: ['storytelling', 'editing', 'creativity'],
  Government: ['policy', 'communication', 'analysis'],
  Science: ['research', 'analysis', 'lab'],
  Trades: ['hands_on', 'precision', 'safety'],
  Agriculture: ['biology', 'process', 'care'],
  RealEstate: ['sales', 'communication', 'negotiation'],
  Retail: ['service', 'sales', 'organization'],
  Beauty: ['aesthetics', 'service', 'communication'],
  Sports: ['discipline', 'training', 'teamwork'],
  Transportation: ['safety', 'operations', 'navigation'],
  Construction: ['planning', 'safety', 'execution'],
  Energy: ['analysis', 'engineering', 'safety'],
  Research: ['research', 'analysis', 'writing']
};

const CAREER_LIBRARY = {
  Technology: [
    'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
    'Mobile Developer', 'Game Developer', 'QA Engineer', 'DevOps Engineer',
    'Cloud Engineer', 'Network Engineer', 'Cybersecurity Analyst', 'AI Engineer',
    'Embedded Engineer', 'Systems Engineer', 'Site Reliability Engineer', 'IT Support',
    'IT Administrator', 'Database Administrator', 'Security Engineer', 'Automation Engineer',
    'AI Researcher', 'MLOps Engineer', 'AR/VR Developer', 'Blockchain Developer',
    'Solutions Architect', 'Platform Engineer', 'DevSecOps Engineer', 'Product Security Engineer',
    'Systems Administrator', 'Technical Support Engineer'
  ],
  Data: [
    'Data Analyst', 'Data Engineer', 'Data Scientist', 'Business Intelligence Analyst',
    'Data Visualization Specialist', 'Machine Learning Engineer', 'Quant Analyst',
    'Research Analyst', 'Product Analyst', 'Growth Analyst', 'Analytics Engineer',
    'BI Developer', 'Data Governance Specialist', 'Data Quality Analyst', 'Data Steward',
    'Decision Scientist'
  ],
  Design: [
    'UI/UX Designer', 'Graphic Designer', 'Product Designer', 'UX Researcher',
    'Interaction Designer', 'Motion Designer', '3D Designer', 'Brand Designer',
    'Illustrator', 'Game Artist', 'Service Designer', 'Design Systems Designer',
    'Visual Designer', 'UX Writer', 'Creative Technologist', 'Art Director',
    'Industrial Designer', 'Packaging Designer'
  ],
  Business: [
    'Business Analyst', 'Product Manager', 'Project Manager', 'Operations Manager',
    'HR Specialist', 'Recruiter', 'Sales Representative', 'Account Manager',
    'Customer Success', 'Business Development', 'Office Manager', 'Procurement Specialist',
    'Strategy Analyst', 'Operations Analyst', 'Management Consultant',
    'Customer Experience Manager', 'Supply Chain Manager'
  ],
  Marketing: [
    'Marketing Specialist', 'SEO Specialist', 'Social Media Manager', 'Content Creator',
    'Copywriter', 'Performance Marketer', 'Brand Manager', 'PR Specialist',
    'Community Manager', 'Event Planner', 'Growth Marketer', 'CRM Specialist',
    'Email Marketing Specialist', 'Marketing Analyst', 'Influencer Manager',
    'Brand Strategist'
  ],
  Finance: [
    'Financial Analyst', 'Accountant', 'Auditor', 'Tax Specialist',
    'Investment Analyst', 'Risk Analyst', 'Treasury Specialist', 'Controller',
    'Credit Analyst', 'Insurance Specialist', 'Financial Planner', 'Wealth Manager',
    'Investment Banker', 'Equity Research Analyst', 'Actuary', 'Risk Manager'
  ],
  Education: [
    'Teacher', 'English Teacher', 'Math Teacher', 'Academic Advisor',
    'Education Counselor', 'Trainer', 'Instructional Designer', 'School Administrator',
    'STEM Teacher', 'Career Coach', 'E-learning Specialist', 'Academic Researcher',
    'School Psychologist', 'Education Content Developer'
  ],
  Healthcare: [
    'Nurse', 'Pharmacist', 'Lab Technician', 'Medical Assistant',
    'Physiotherapist', 'Radiology Technician', 'Dentist Assistant', 'Public Health Officer',
    'Doctor', 'Dentist', 'Clinical Psychologist', 'Occupational Therapist', 'Nutritionist',
    'Health Informatics Specialist', 'Medical Sales Representative', 'Healthcare Administrator'
  ],
  Engineering: [
    'Civil Engineer', 'Mechanical Engineer', 'Electrical Engineer', 'Industrial Engineer',
    'Automation Engineer', 'Robotics Engineer', 'Environmental Engineer', 'Architect',
    'Chemical Engineer', 'Aerospace Engineer', 'Biomedical Engineer', 'Quality Engineer',
    'Process Engineer', 'Mechatronics Engineer', 'Energy Engineer', 'Materials Engineer'
  ],
  Legal: [
    'Legal Assistant', 'Paralegal', 'Compliance Officer', 'Legal Consultant',
    'Lawyer', 'Legal Advisor', 'Contract Manager', 'IP Specialist', 'Compliance Manager'
  ],
  Hospitality: [
    'Hotel Manager', 'Tour Guide', 'Chef', 'Restaurant Manager',
    'Travel Consultant', 'Event Coordinator', 'Resort Manager', 'Event Manager',
    'Bartender', 'Barista', 'Sommelier'
  ],
  Logistics: [
    'Supply Chain Analyst', 'Logistics Coordinator', 'Warehouse Manager', 'Operations Planner',
    'Customs Specialist', 'Demand Planner', 'Fleet Supervisor', 'Import Export Coordinator'
  ],
  Media: [
    'Journalist', 'Video Editor', 'Photographer', 'Media Producer',
    'Content Strategist', 'Podcast Producer', 'Animator', 'Scriptwriter',
    'Social Media Producer', 'Sound Designer', 'Media Planner'
  ],
  Government: [
    'Policy Analyst', 'Public Relations Officer', 'Civil Servant',
    'Diplomat', 'Urban Planner', 'Regulatory Affairs Specialist', 'Public Policy Advisor'
  ],
  Science: [
    'Research Assistant', 'Lab Researcher', 'Biologist', 'Chemist',
    'Physicist', 'Environmental Scientist', 'Food Scientist', 'Biochemist',
    'Geneticist', 'Geologist', 'Meteorologist', 'Epidemiologist', 'Microbiologist'
  ],
  Trades: [
    'Electrician', 'Mechanic', 'Plumber', 'Carpenter',
    'Welder', 'Technician', 'HVAC Technician', 'Painter',
    'Machinist', 'Auto Technician'
  ],
  Agriculture: [
    'Agronomist', 'Farm Manager', 'Food Technologist', 'Veterinary Assistant',
    'Aquaculture Specialist', 'Greenhouse Technician', 'Soil Scientist',
    'Food Safety Specialist', 'Agricultural Engineer', 'Agribusiness Specialist'
  ],
  RealEstate: [
    'Real Estate Agent', 'Property Manager', 'Real Estate Analyst', 'Leasing Consultant',
    'Property Valuer', 'Real Estate Broker'
  ],
  Retail: [
    'Retail Manager', 'Merchandiser', 'Store Supervisor', 'Inventory Specialist',
    'Category Manager', 'Buyer', 'E-commerce Merchandiser'
  ],
  Beauty: [
    'Makeup Artist', 'Hair Stylist', 'Skincare Specialist', 'Spa Therapist',
    'Nail Technician', 'Cosmetologist', 'Esthetician'
  ],
  Sports: [
    'Coach', 'Fitness Trainer', 'Sports Analyst', 'Physiotherapist (Sports)',
    'Sports Physiologist', 'Strength Coach', 'Sports Nutritionist'
  ],
  Transportation: [
    'Logistics Driver', 'Fleet Manager', 'Transport Planner', 'Pilot Assistant',
    'Air Traffic Controller', 'Flight Dispatcher', 'Maritime Officer', 'Rail Operations Manager'
  ],
  Construction: [
    'Construction Manager', 'Site Engineer', 'Surveyor', 'Safety Officer',
    'Quantity Surveyor', 'Structural Engineer', 'Construction Planner'
  ]
};

const SPECIALIZED_BLUEPRINTS = [
  {
    category: 'Technology',
    domains: [
      'Web', 'Mobile', 'Cloud', 'DevOps', 'Security', 'AI', 'Machine Learning',
      'Data', 'Embedded Systems', 'Robotics', 'IoT', 'Blockchain', 'AR/VR',
      'Game', 'Platform', 'Infrastructure', 'Network', 'Automation', 'QA',
      'Computer Vision', 'NLP'
    ],
    roles: ['Engineer', 'Developer', 'Architect', 'Analyst', 'Specialist', 'Researcher', 'Scientist']
  },
  {
    category: 'Engineering',
    domains: [
      'Mechanical', 'Electrical', 'Electronics', 'Automation', 'Robotics',
      'Mechatronics', 'Civil', 'Structural', 'Geotechnical', 'HVAC',
      'Industrial', 'Chemical', 'Materials', 'Aerospace', 'Marine',
      'Biomedical', 'Energy Systems', 'Power Systems', 'Control Systems', 'Optical'
    ],
    roles: ['Engineer', 'Technician', 'Consultant', 'Manager', 'Inspector', 'Planner']
  },
  {
    category: 'Science',
    domains: [
      'Physics', 'Chemistry', 'Biology', 'Biochemistry', 'Genetics', 'Microbiology',
      'Neuroscience', 'Environmental Science', 'Food Science', 'Materials Science',
      'Geology', 'Meteorology', 'Oceanography', 'Astronomy', 'Pharmacology',
      'Nanotechnology', 'Biotechnology', 'Quantum Science', 'Ecology', 'Zoology'
    ],
    roles: ['Scientist', 'Researcher', 'Analyst', 'Lab Technician', 'Associate']
  },
  {
    category: 'Education',
    domains: [
      'Math', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'English',
      'Literature', 'History', 'Geography', 'Economics', 'Business', 'Marketing',
      'Design', 'Art', 'Music', 'Psychology', 'Data Science', 'AI', 'Robotics',
      'Electronics', 'Automation', 'Finance', 'Law', 'Healthcare', 'Philosophy'
    ],
    roles: ['Teacher', 'Lecturer', 'Professor', 'Tutor', 'Curriculum Designer', 'Instructor']
  },
  {
    category: 'Healthcare',
    domains: [
      'Cardiology', 'Oncology', 'Pediatrics', 'Neurology', 'Radiology', 'Dermatology',
      'Orthopedics', 'Pharmacy', 'Dentistry', 'Mental Health', 'Rehabilitation',
      'Nutrition', 'Public Health', 'Clinical Lab', 'Emergency', 'Anesthesia',
      'Ophthalmology', 'Pathology'
    ],
    roles: ['Specialist', 'Nurse', 'Technician', 'Therapist', 'Researcher', 'Assistant']
  },
  {
    category: 'Business',
    domains: [
      'Strategy', 'Operations', 'HR', 'Supply Chain', 'Retail', 'E-commerce',
      'Product', 'Project', 'Procurement', 'Risk', 'Compliance', 'Customer Success',
      'Business Development', 'Sales', 'Partnerships', 'Analytics', 'Consulting'
    ],
    roles: ['Manager', 'Analyst', 'Consultant', 'Specialist', 'Director', 'Coordinator']
  },
  {
    category: 'Marketing',
    domains: [
      'Brand', 'Growth', 'Performance', 'Content', 'SEO', 'Social Media',
      'CRM', 'PR', 'Market Research', 'Community', 'Influencer', 'Product Marketing'
    ],
    roles: ['Specialist', 'Manager', 'Analyst', 'Strategist', 'Lead']
  },
  {
    category: 'Finance',
    domains: [
      'Accounting', 'Audit', 'Tax', 'Corporate Finance', 'Investment', 'Risk',
      'Insurance', 'Treasury', 'Banking', 'FinTech', 'Wealth', 'Credit'
    ],
    roles: ['Analyst', 'Manager', 'Advisor', 'Specialist', 'Controller']
  },
  {
    category: 'Legal',
    domains: [
      'Corporate', 'IP', 'Compliance', 'Tax', 'Labor', 'International',
      'Data Privacy', 'Regulatory', 'Contracts', 'Real Estate'
    ],
    roles: ['Lawyer', 'Advisor', 'Specialist', 'Counsel', 'Analyst']
  },
  {
    category: 'Media',
    domains: [
      'Video', 'Film', 'Animation', 'Audio', 'Journalism', 'Podcast',
      'Photography', 'Broadcast', 'Digital Media', 'Gaming', 'Sports Media'
    ],
    roles: ['Producer', 'Editor', 'Designer', 'Reporter', 'Director', 'Strategist']
  },
  {
    category: 'Logistics',
    domains: [
      'Transportation', 'Warehouse', 'Inventory', 'Import/Export', 'Fleet',
      'Last-mile', 'Cold Chain', 'Distribution', 'Demand Planning'
    ],
    roles: ['Manager', 'Planner', 'Coordinator', 'Analyst', 'Supervisor']
  },
  {
    category: 'Construction',
    domains: [
      'Structural', 'MEP', 'Civil', 'Geotechnical', 'HVAC', 'Safety',
      'Project', 'Site', 'Quality'
    ],
    roles: ['Engineer', 'Manager', 'Supervisor', 'Planner', 'Inspector']
  },
  {
    category: 'Agriculture',
    domains: [
      'Crop', 'Livestock', 'Aquaculture', 'AgriTech', 'Soil', 'Food Safety',
      'Supply Chain', 'Greenhouse', 'Seed', 'Irrigation'
    ],
    roles: ['Specialist', 'Engineer', 'Technician', 'Manager', 'Consultant']
  },
  {
    category: 'Energy',
    domains: [
      'Renewable', 'Solar', 'Wind', 'Hydro', 'Grid', 'Battery',
      'Oil & Gas', 'Nuclear', 'Energy Storage', 'Power Generation'
    ],
    roles: ['Engineer', 'Analyst', 'Technician', 'Consultant', 'Manager']
  },
  {
    category: 'Research',
    domains: [
      'AI Safety', 'Quantum Computing', 'Robotics', 'Materials', 'Biotech',
      'Energy Systems', 'Climate', 'Neuroscience', 'Social Science', 'Economics',
      'Education', 'Healthcare', 'Behavioral Science'
    ],
    roles: ['Researcher', 'Scientist', 'Fellow', 'Associate', 'Lab Director']
  }
];

function generateSpecializedCareers() {
  const items = [];
  for (const group of SPECIALIZED_BLUEPRINTS) {
    for (const domain of group.domains) {
      for (const role of group.roles) {
        items.push({
          name: `${domain} ${role}`.replace(/\s+/g, ' ').trim(),
          category: group.category
        });
      }
    }
  }
  return items;
}

function buildCareerRecords() {
  const records = [];
  const seen = new Set();

  function pushRecord(name, category) {
    const key = `${name}`.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    records.push({
      name,
      category,
      required_skills: CATEGORY_SKILLS[category] || ['communication', 'analysis'],
      salary_range: "Thoa thuan",
      job_outlook: "good",
      description: `${name} thuoc nhom ${category}`
    });
  }

  for (const [category, names] of Object.entries(CAREER_LIBRARY)) {
    for (const name of names) {
      pushRecord(name, category);
    }
  }

  const specialized = generateSpecializedCareers();
  for (const item of specialized) {
    pushRecord(item.name, item.category);
  }

  if (records.length < 1000) {
    const levels = ['Junior', 'Senior', 'Lead', 'Principal'];
    const snapshot = [...records];
    let idx = 0;
    while (records.length < 1000 && idx < snapshot.length * levels.length) {
      const base = snapshot[idx % snapshot.length];
      const level = levels[idx % levels.length];
      pushRecord(`${level} ${base.name}`, base.category);
      idx += 1;
    }
  }

  return records;
}

module.exports = { buildCareerRecords };
