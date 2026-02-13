let GENERATED_CAREER_RECORDS = [];
try {
  // Auto-generated from open occupation sources (can be thousands of entries).
  ({ GENERATED_CAREER_RECORDS } = require('./generatedCareerDataset'));
} catch {
  GENERATED_CAREER_RECORDS = [];
}

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
  Research: ['research', 'analysis', 'writing'],
  Administration: ['organization', 'documentation', 'communication'],
  PublicService: ['policy', 'community', 'administration'],
  Manufacturing: ['operations', 'quality', 'safety'],
  Environment: ['sustainability', 'analysis', 'field_work'],
  SecurityDefense: ['discipline', 'safety', 'operations'],
  ECommerce: ['analytics', 'sales', 'operations'],
  Insurance: ['risk_assessment', 'communication', 'analysis'],
  HumanResources: ['communication', 'evaluation', 'organization'],
  CustomerService: ['service', 'communication', 'problem_solving'],
  Banking: ['finance', 'compliance', 'analysis'],
  Procurement: ['negotiation', 'analysis', 'operations'],
  Product: ['analysis', 'roadmapping', 'communication'],
  Consulting: ['analysis', 'communication', 'problem_solving'],
  InternationalBusiness: ['communication', 'trade', 'negotiation'],
  CivilService: ['administration', 'policy', 'community']
};

const CAREER_LIBRARY = {
  Technology: [
    'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
    'Mobile Developer', 'Game Developer', 'QA Engineer', 'DevOps Engineer',
    'Cloud Engineer', 'Network Engineer', 'Cybersecurity Analyst', 'AI Engineer',
    'Embedded Engineer', 'Systems Engineer', 'Site Reliability Engineer', 'IT Support',
    'IT Administrator', 'Database Administrator', 'Security Engineer', 'Automation Engineer',
    'Technical Support Engineer', 'Web Developer', 'System Administrator', 'IT Consultant',
    'IT Project Manager', 'Data Center Engineer', 'IT Trainer', 'IT Auditor', 'IT Sales Specialist',
    'IT Procurement Specialist', 'IT Business Analyst', 'IT Operations Specialist', 'IT Service Manager'
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
    'Visual Designer', 'UX Writer', 'Art Director', 'Industrial Designer', 'Packaging Designer',
    'Fashion Designer', 'Interior Designer', 'Web Designer', 'Advertising Designer',
    'Animation Designer', 'Event Designer', 'Video Designer', 'Sound Designer',
    'Book Designer', 'Magazine Designer', 'Film Designer', 'Game Designer'
  ],
  Business: [
    'Business Analyst', 'Product Manager', 'Project Manager', 'Operations Manager',
    'HR Specialist', 'Recruiter', 'Sales Representative', 'Account Manager',
    'Customer Success', 'Business Development', 'Office Manager', 'Procurement Specialist',
    'Strategy Analyst', 'Operations Analyst', 'Management Consultant',
    'Customer Experience Manager', 'Supply Chain Manager',
    'CEO', 'CFO', 'CMO', 'CHRO', 'Sales Manager', 'Project Manager', 'HR Manager', 'Marketing Manager',
    'Market Development Specialist', 'Business Data Analyst', 'Supply Chain Specialist', 'Risk Manager',
    'Quality Manager', 'Customer Manager', 'Product Manager', 'Finance Manager', 'Operations Manager',
    'Strategy Manager', 'Brand Manager', 'Sales Specialist', 'Contract Manager', 'Purchasing Manager', 'Office Manager',
    'Nhân viên Kinh doanh', 'Chuyên viên Kinh doanh', 'Nhân viên Phát triển Thị trường',
    'Giám sát Kinh doanh', 'Trưởng nhóm Kinh doanh', 'Quản lý Kinh doanh Khu vực',
    'Nhân viên Sales B2B', 'Nhân viên Sales B2C', 'Inside Sales', 'Telesales',
    'Sales Operation Specialist', 'Sales Trainer', 'Sales Enablement Specialist',
    'Trade Marketing Executive', 'Merchandiser', 'Key Account Executive', 'Key Account Manager',
    'Customer Relationship Manager', 'Channel Sales Executive', 'Channel Development Manager',
    'Partnership Manager', 'Strategic Partnership Specialist', 'Franchise Development Specialist',
    'Commercial Executive', 'Commercial Manager'
  ],
  Marketing: [
    'Marketing Specialist', 'SEO Specialist', 'Social Media Manager', 'Content Creator',
    'Copywriter', 'Performance Marketer', 'Brand Manager', 'PR Specialist',
    'Community Manager', 'Event Planner', 'Growth Marketer', 'CRM Specialist',
    'Email Marketing Specialist', 'Marketing Analyst', 'Influencer Manager',
    'Brand Strategist', 'Digital Marketing Executive', 'Performance Marketing Specialist',
    'SEO/SEM Specialist', 'Paid Ads Specialist', 'Media Planner', 'Media Buyer',
    'Content Strategist', 'Content Marketing Specialist', 'Marketing Automation Specialist',
    'Affiliate Marketing Specialist', 'E-commerce Marketing Specialist', 'Trade Marketing Specialist',
    'Brand Communications Executive', 'Corporate Communications Specialist', 'PR Executive',
    'Event Marketing Specialist', 'Product Marketing Manager', 'Lifecycle Marketing Specialist',
    'Retention Marketing Specialist', 'Market Research Analyst', 'Consumer Insight Specialist'
  ],
  Finance: [
    'Financial Analyst', 'Accountant', 'Auditor', 'Tax Specialist',
    'Investment Analyst', 'Risk Analyst', 'Treasury Specialist',
    'Credit Analyst', 'Insurance Specialist', 'Financial Planner',
    'Investment Banker', 'Actuary'
  ],
  Education: [
    'Giáo viên Tiểu học',
    'Giáo viên Trung học cơ sở',
    'Giáo viên Trung học phổ thông',
    'Giảng viên Đại học / Cao đẳng',
    'Giáo viên Đào tạo nghề',
    'Giáo viên Giáo dục đặc biệt',
    'Gia sư / Giáo viên kèm'
  ],
  Healthcare: [
    'Bác sĩ', 'Y tá / Điều dưỡng', 'Dược sĩ', 'Nha sĩ',
    'Kỹ thuật viên Y tế', 'Nhân viên Chăm sóc sức khỏe',
    'Nhà Tâm lý học Lâm sàng', 'Vật lý trị liệu',
    'Chuyên viên Dinh dưỡng', 'Quản lý Y tế'
  ],
  Engineering: [
    'Kỹ sư Xây dựng', 'Kỹ sư Cơ khí', 'Kỹ sư Điện', 'Kỹ sư Công nghiệp',
    'Kỹ sư Tự động hóa', 'Kiến trúc sư', 'Kỹ sư Hóa học',
    'Kỹ sư Môi trường', 'Kỹ sư Năng lượng'
  ],
  Legal: [
    'Luật sư', 'Trợ lý Pháp lý', 'Chuyên viên Tuân thủ',
    'Tư vấn Pháp lý', 'Chuyên viên Hợp đồng'
  ],
  Hospitality: [
    'Quản lý Khách sạn', 'Hướng dẫn viên Du lịch', 'Đầu bếp',
    'Quản lý Nhà hàng', 'Tư vấn Du lịch', 'Điều phối Sự kiện'
  ],
  Logistics: [
    'Chuyên viên Chuỗi cung ứng', 'Điều phối Logistics',
    'Quản lý Kho', 'Chuyên viên Hải quan', 'Quản lý Vận tải'
  ],
  Media: [
    'Nhà báo', 'Biên tập viên Video', 'Nhiếp ảnh gia',
    'Nhà sản xuất Truyền thông', 'Chuyên gia Nội dung',
    'Nhà sản xuất Podcast', 'Họa sĩ Hoạt hình', 'Biên kịch',
    'Chuyên gia PR', 'Quản lý Truyền thông Xã hội'
  ],
  Government: [
    'Chuyên viên Chính sách', 'Công chức',
    'Nhà Ngoại giao', 'Quy hoạch Đô thị'
  ],
  Science: [
    'Nhà Nghiên cứu Khoa học',
    'Kỹ thuật viên Phòng thí nghiệm',
    'Nhà Khoa học Môi trường',
    'Nhà Khoa học Thực phẩm'
  ],
  Trades: [
    'Thợ Điện', 'Thợ Cơ khí', 'Thợ Sửa ống nước', 'Thợ Mộc',
    'Thợ Hàn', 'Kỹ thuật viên', 'Thợ Sơn'
  ],
  Agriculture: [
    'Kỹ sư Nông nghiệp', 'Quản lý Trang trại',
    'Chuyên gia Công nghệ Thực phẩm', 'Trợ lý Thú y',
    'Chuyên viên An toàn Thực phẩm'
  ],
  RealEstate: [
    'Môi giới Bất động sản', 'Quản lý Tài sản',
    'Chuyên viên Phân tích Bất động sản', 'Tư vấn Cho thuê',
    'Sales Bất động sản', 'Nhân viên Kinh doanh Bất động sản', 'Chuyên viên Tư vấn Bất động sản',
    'Chuyên viên Phát triển Dự án Bất động sản', 'Chuyên viên Quan hệ Khách hàng Bất động sản',
    'Quản lý Sàn Giao dịch Bất động sản', 'Property Sales Consultant', 'Leasing Executive'
  ],
  Retail: [
    'Quản lý Bán lẻ', 'Chuyên viên Hàng hóa',
    'Giám sát Cửa hàng', 'Quản lý Tồn kho', 'Quản lý Thương mại điện tử'
  ],
  Beauty: [
    'Chuyên viên Trang điểm', 'Nhà Tạo mẫu Tóc',
    'Chuyên gia Chăm sóc Da', 'Nhân viên Spa'
  ],
  Sports: [
    'Huấn luyện viên', 'Chuyên gia Thể dục',
    'Chuyên viên Phân tích Thể thao', 'Chuyền gia Dinh dưỡng Thể thao'
  ],
  Transportation: [
    'Quản lý Vận tải', 'Chuyên gia Quy hoạch Giao thông',
    'Kiểm soát viên Không lưu', 'Nhân viên Điều hành Bay',
    'Lái xe tải', 'Lái xe bus', 'Lái xe taxi / công nghệ', 'Điều phối viên đội xe', 'Nhân viên điều độ vận tải'
  ],
  Construction: [
    'Quản lý Xây dựng', 'Kỹ sư Công trường',
    'Khảo sát viên', 'Chuyên viên An toàn Xây dựng', 'Kỹ sư Kết cấu'
  ],
  Administration: [
    'Nhân viên Hành chính văn phòng', 'Trợ lý Hành chính', 'Thư ký', 'Lễ tân',
    'Nhân viên Nhập liệu', 'Nhân viên Văn thư lưu trữ', 'Điều phối viên văn phòng',
    'Nhân viên CSKH', 'Nhân viên Tổng đài', 'Nhân viên xử lý hồ sơ',
    'Trợ lý Kinh doanh', 'Trợ lý Dự án', 'Chuyên viên Hành chính Nhân sự',
    'Chuyên viên Hỗ trợ Vận hành', 'Chuyên viên Quản trị Văn phòng',
    'Executive Assistant', 'Personal Assistant'
  ],
  PublicService: [
    'Công chức Hành chính', 'Viên chức Giáo dục', 'Viên chức Y tế', 'Chuyên viên UBND',
    'Cán bộ Phòng Lao động - Thương binh và Xã hội', 'Chuyên viên Phòng Tài nguyên và Môi trường',
    'Chuyên viên Thuế', 'Chuyên viên Hải quan', 'Cán bộ Kho bạc', 'Cán bộ Bảo hiểm xã hội'
  ],
  Manufacturing: [
    'Kỹ thuật viên Sản xuất', 'Quản đốc Phân xưởng', 'Chuyên viên Kiểm soát Chất lượng',
    'Nhân viên QA/QC', 'Kỹ thuật viên Bảo trì', 'Nhân viên Vận hành máy', 'Kỹ sư Quy trình',
    'Kỹ sư Sản xuất', 'Nhân viên An toàn lao động'
  ],
  Environment: [
    'Chuyên viên Môi trường', 'Kỹ sư Môi trường', 'Chuyên viên Quan trắc môi trường',
    'Chuyên viên ESG', 'Chuyên viên Quản lý chất thải', 'Kiểm định viên môi trường'
  ],
  SecurityDefense: [
    'Cảnh sát', 'Sĩ quan Quân đội', 'Bảo vệ Chuyên nghiệp', 'Chuyên viên An ninh',
    'Điều tra viên', 'Cán bộ Phòng cháy chữa cháy', 'Nhân viên An ninh sân bay'
  ],
  ECommerce: [
    'Chuyên viên Vận hành Sàn Thương mại điện tử', 'E-commerce Executive', 'E-commerce Manager',
    'E-commerce Analyst', 'Marketplace Specialist', 'Category Manager', 'Online Merchandiser',
    'Livestream Sales Specialist', 'Social Commerce Specialist', 'Customer Experience Executive'
  ],
  Insurance: [
    'Tư vấn Bảo hiểm', 'Chuyên viên Thẩm định Bảo hiểm', 'Chuyên viên Bồi thường',
    'Underwriter', 'Insurance Sales Specialist', 'Bancassurance Specialist'
  ],
  HumanResources: [
    'HR Generalist', 'Talent Acquisition Specialist', 'Compensation & Benefits Specialist',
    'Learning & Development Specialist', 'HR Business Partner', 'Employee Relations Specialist',
    'Payroll Specialist', 'HR Operations Specialist'
  ],
  CustomerService: [
    'Chuyên viên Chăm sóc Khách hàng', 'Customer Support Specialist', 'Call Center Agent',
    'Customer Success Specialist', 'Customer Experience Specialist', 'Technical Support Specialist'
  ],
  Banking: [
    'Giao dịch viên Ngân hàng', 'Chuyên viên Quan hệ Khách hàng Doanh nghiệp',
    'Chuyên viên Quan hệ Khách hàng Cá nhân', 'Chuyên viên Tín dụng',
    'Chuyên viên Thanh toán Quốc tế', 'Chuyên viên Quản trị Rủi ro Ngân hàng'
  ],
  Procurement: [
    'Chuyên viên Mua hàng', 'Purchasing Executive', 'Procurement Analyst',
    'Strategic Sourcing Specialist', 'Vendor Management Specialist'
  ],
  Product: [
    'Product Owner', 'Associate Product Manager', 'Product Operations Specialist',
    'Product Marketing Specialist', 'Product Strategy Analyst'
  ],
  Consulting: [
    'Tư vấn Chiến lược', 'Tư vấn Quản trị', 'Tư vấn Chuyển đổi số',
    'Tư vấn Vận hành', 'Business Transformation Analyst'
  ],
  InternationalBusiness: [
    'Chuyên viên Xuất nhập khẩu', 'International Sales Executive', 'Trade Compliance Specialist',
    'Logistics Import-Export Coordinator', 'Global Sourcing Specialist'
  ],
  CivilService: [
    'Chuyên viên Văn phòng UBND', 'Cán bộ Tư pháp - Hộ tịch', 'Chuyên viên Nội vụ',
    'Chuyên viên Kế hoạch - Đầu tư', 'Cán bộ Văn hóa - Xã hội', 'Công chức Địa chính'
  ]
};

/**
 * Build career records from CAREER_LIBRARY only
 * Simplified to keep only general careers (~250 total)
 */
function buildCareerRecords() {
  const records = [];
  const seen = new Set();

  function pushRecord(name, category, sourceRecord = null) {
    // Explicitly exclude specific roles requested by user
    if (name.includes('Giáo viên Toán STEM') || name.includes('Giảng viên Toán đội tuyển')) {
      return;
    }

    const key = `${name}`.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);

    const sourceSkills = Array.isArray(sourceRecord?.required_skills)
      ? sourceRecord.required_skills.filter(Boolean)
      : null;
    const resolvedSkills = sourceSkills && sourceSkills.length > 0
      ? sourceSkills
      : (CATEGORY_SKILLS[category] || ['communication', 'analysis']);

    records.push({
      name,
      category,
      required_skills: resolvedSkills,
      salary_range: String(sourceRecord?.salary_range || 'Thỏa thuận'),
      job_outlook: String(sourceRecord?.job_outlook || 'good'),
      description: String(sourceRecord?.description || `${name} thuộc nhóm ${category}`)
    });
  }

  // Only use CAREER_LIBRARY - no specialized blueprints
  for (const [category, names] of Object.entries(CAREER_LIBRARY)) {
    for (const name of names) {
      pushRecord(name, category);
    }
  }

  // Merge large generated catalog (if present) to dramatically expand coverage.
  for (const rec of GENERATED_CAREER_RECORDS) {
    const name = String(rec?.name || '').trim();
    const category = String(rec?.category || '').trim() || 'Business';
    if (!name) continue;
    pushRecord(name, category, rec);
  }

  return records;
}

module.exports = { buildCareerRecords };
