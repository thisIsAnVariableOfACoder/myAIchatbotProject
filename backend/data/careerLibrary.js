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
    'Strategy Manager', 'Brand Manager', 'Sales Specialist', 'Contract Manager', 'Purchasing Manager', 'Office Manager'
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
    'Chuyên viên Phân tích Bất động sản', 'Tư vấn Cho thuê'
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
    'Kiểm soát viên Không lưu', 'Nhân viên Điều hành Bay'
  ],
  Construction: [
    'Quản lý Xây dựng', 'Kỹ sư Công trường',
    'Khảo sát viên', 'Chuyên viên An toàn Xây dựng', 'Kỹ sư Kết cấu'
  ]
};

/**
 * Build career records from CAREER_LIBRARY only
 * Simplified to keep only general careers (~250 total)
 */
function buildCareerRecords() {
  const records = [];
  const seen = new Set();

  function pushRecord(name, category) {
    // Explicitly exclude specific roles requested by user
    if (name.includes('Giáo viên Toán STEM') || name.includes('Giảng viên Toán đội tuyển')) {
      return;
    }

    const key = `${name}`.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    records.push({
      name,
      category,
      required_skills: CATEGORY_SKILLS[category] || ['communication', 'analysis'],
      salary_range: "Thỏa thuận",
      job_outlook: "good",
      description: `${name} thuộc nhóm ${category}`
    });
  }

  // Only use CAREER_LIBRARY - no specialized blueprints
  for (const [category, names] of Object.entries(CAREER_LIBRARY)) {
    for (const name of names) {
      pushRecord(name, category);
    }
  }

  return records;
}

module.exports = { buildCareerRecords };
