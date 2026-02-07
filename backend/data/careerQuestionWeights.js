/**
 * Career-Question Weight Matrix
 * Template-based question system with career-specific scoring
 */

/**
 * Question templates with career targeting
 * Each template will generate multiple questions
 */
const QUESTION_TEMPLATES = [
    // === SKILLS & ABILITIES ===
    {
        id_prefix: 'skill',
        templates: [
            {
                text: 'Bạn có giỏi {skill} không?',
                type: 'skill_direct',
                variables: ['skill'],
                weight_default: 15
            },
            {
                text: 'Bạn có thích học và phát triển kỹ năng {skill} không?',
                type: 'skill_interest',
                variables: ['skill'],
                weight_default: 12
            },
            {
                text: 'Bạn cảm thấy tự tin khi sử dụng {skill} trong công việc không?',
                type: 'skill_confidence',
                variables: ['skill'],
                weight_default: 14
            }
        ]
    },

    // === INTERESTS & PASSION ===
    {
        id_prefix: 'interest',
        templates: [
            {
                text: 'Bạn có hứng thú với lĩnh vực {domain} không?',
                type: 'domain_interest',
                variables: ['domain'],
                weight_default: 18
            },
            {
                text: 'Bạn có thích làm việc với {tool_or_subject} không?',
                type: 'tool_interest',
                variables: ['tool_or_subject'],
                weight_default: 16
            },
            {
                text: 'Bạn có muốn giải quyết các vấn đề liên quan đến {problem_area} không?',
                type: 'problem_focus',
                variables: ['problem_area'],
                weight_default: 17
            }
        ]
    },

    // === WORK STYLE ===
    {
        id_prefix: 'workstyle',
        templates: [
            {
                text: 'Bạn thích làm việc {work_mode} không?',
                type: 'work_mode',
                variables: ['work_mode'],
                weight_default: 10
            },
            {
                text: 'Bạn có thích môi trường làm việc {environment} không?',
                type: 'environment',
                variables: ['environment'],
                weight_default: 8
            }
        ]
    },

    // === CAREER-SPECIFIC SCENARIOS ===
    {
        id_prefix: 'scenario',
        templates: [
            {
                text: 'Bạn có muốn {job_activity} trong công việc hàng ngày không?',
                type: 'daily_activity',
                variables: ['job_activity'],
                weight_default: 20
            },
            {
                text: 'Bạn có sẵn sàng {job_challenge} không?',
                type: 'challenge',
                variables: ['job_challenge'],
                weight_default: 12
            }
        ]
    }
];

/**
 * Variable values mapped to career categories
 */
const VARIABLE_MAPPINGS = {
    skill: [
        // Tech & Engineering
        { value: 'lập trình', careers: ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Mobile Developer', 'Data Engineer', 'DevOps Engineer', 'ML Engineer', 'AI Engineer'], weight: 20 },
        { value: 'phân tích dữ liệu', careers: ['Data Analyst', 'Data Scientist', 'Business Analyst', 'Financial Analyst', 'Marketing Analyst', 'Research Analyst'], weight: 18 },
        { value: 'thiết kế kỹ thuật', careers: ['Kỹ sư Xây dựng', 'Kỹ sư Cơ khí', 'Kỹ sư Điện', 'Kiến trúc sư', 'Kỹ sư Công nghiệp'], weight: 19 },
        { value: 'giải quyết vấn đề kỹ thuật', careers: ['Software Engineer', 'Kỹ sư Điện', 'Kỹ sư Cơ khí', 'DevOps Engineer', 'System Architect'], weight: 18 },

        // Design & Creative
        { value: 'thiết kế đồ họa', careers: ['UI Designer', 'UX Designer', 'Graphic Designer', 'Product Designer', 'Visual Designer'], weight: 20 },
        { value: 'viết lách', careers: ['Content Writer', 'Copywriter', 'Biên kịch', 'Nhà báo', 'Technical Writer'], weight: 18 },
        { value: 'tư duy sáng tạo', careers: ['UI Designer', 'UX Designer', 'Creative Director', 'Art Director', 'Brand Manager'], weight: 17 },
        { value: 'biên tập', careers: ['Biên tập viên Video', 'Content Editor', 'Nhà báo', 'Publisher'], weight: 17 },

        // Business & Management
        { value: 'giao tiếp', careers: ['Marketing Manager', 'PR Specialist', 'Sales Manager', 'Account Manager', 'HR Manager'], weight: 14 },
        { value: 'quản lý dự án', careers: ['Project Manager', 'Product Manager', 'Quản lý Xây dựng', 'Program Manager'], weight: 17 },
        { value: 'quản lý nhân sự', careers: ['HR Manager', 'HR Business Partner', 'Talent Specialist', 'Giám đốc Nhân sự'], weight: 18 },
        { value: 'quản lý tài chính', careers: ['Financial Analyst', 'Accountant', 'CFO', 'Controller'], weight: 18 },
        { value: 'bán hàng', careers: ['Sales Manager', 'Account Executive', 'Business Development', 'Sales Representative'], weight: 17 },
        { value: 'marketing', careers: ['Marketing Manager', 'Digital Marketer', 'Growth Hacker', 'Brand Manager'], weight: 17 },

        // Healthcare & Education
        { value: 'dạy học', careers: ['Giáo viên Tiểu học', 'Giáo viên Trung học cơ sở', 'Giáo viên Trung học phổ thông', 'Giảng viên Đại học / Cao đẳng', 'Gia sư / Giáo viên kèm'], weight: 20 },
        { value: 'chăm sóc sức khỏe', careers: ['Bác sĩ', 'Y tá / Điều dưỡng', 'Dược sĩ', 'Vật lý trị liệu', 'Nhà Tâm lý học Lâm sàng'], weight: 19 },
        { value: 'tư vấn tâm lý', careers: ['Nhà Tâm lý học Lâm sàng', 'HR Specialist', 'Career Counselor'], weight: 18 },

        // Specialized Skills
        { value: 'tư duy logic', careers: ['Software Engineer', 'Data Scientist', 'Kỹ sư Điện', 'Kỹ sư Cơ khí', 'Business Analyst'], weight: 15 },
        { value: 'nghiên cứu', careers: ['Nhà Nghiên cứu Khoa học', 'Research Analyst', 'UX Researcher', 'Market Researcher'], weight: 18 },
        { value: 'kế toán', careers: ['Accountant', 'Auditor', 'Tax Specialist', 'Financial Analyst'], weight: 19 },
        { value: 'luật pháp', careers: ['Luật sư', 'Trợ lý Pháp lý', 'Tư vấn Pháp lý', 'Chuyên viên Tuân thủ'], weight: 20 },
        { value: 'nấu ăn', careers: ['Đầu bếp', 'Quản lý Nhà hàng', 'Food Technologist'], weight: 18 },
        { value: 'chụp ảnh', careers: ['Nhiếp ảnh gia', 'Product Photographer', 'Photo Editor'], weight: 18 },
        { value: 'vận hành logistics', careers: ['Chuyên viên Chuỗi cung ứng', 'Điều phối Logistics', 'Quản lý Kho'], weight: 17 },
        { value: 'thiết kế nội thất', careers: ['Interior Designer', 'Kiến trúc sư', 'Space Planner'], weight: 18 },
        { value: 'làm vườn', careers: ['Kỹ sư Nông nghiệp', 'Landscape Designer', 'Horticulturist'], weight: 16 }
    ],

    domain: [
        { value: 'công nghệ thông tin', careers: ['Software Engineer', 'Data Engineer', 'DevOps Engineer', 'Cloud Engineer', 'Security Engineer', 'QA Engineer'], weight: 20 },
        { value: 'y tế', careers: ['Bác sĩ', 'Y tá / Điều dưỡng', 'Dược sĩ', 'Quản lý Y tế', 'Kỹ thuật viên Y tế'], weight: 20 },
        { value: 'giáo dục', careers: ['Giáo viên Tiểu học', 'Giáo viên Trung học cơ sở', 'Giáo viên Trung học phổ thông', 'Giảng viên Đại học / Cao đẳng', 'Giáo viên Đào tạo nghề'], weight: 20 },
        { value: 'tài chính', careers: ['Financial Analyst', 'Accountant', 'Investment Analyst', 'Actuary', 'Auditor'], weight: 19 },
        { value: 'truyền thông', careers: ['Nhà báo', 'Biên tập viên Video', 'Chuyên gia Nội dung', 'Chuyên gia PR', 'Quản lý Truyền thông Xã hội'], weight: 18 },
        { value: 'thiết kế', careers: ['UI Designer', 'UX Designer', 'Graphic Designer', 'Product Designer', 'Visual Designer'], weight: 20 },
        { value: 'xây dựng', careers: ['Kỹ sư Xây dựng', 'Kiến trúc sư', 'Quản lý Xây dựng', 'Kỹ sư Công trường'], weight: 19 },
        { value: 'kinh doanh', careers: ['Business Analyst', 'Product Manager', 'Sales Manager', 'Marketing Manager'], weight: 18 },
        { value: 'khoa học', careers: ['Nhà Nghiên cứu Khoa học', 'Kỹ thuật viên Phòng thí nghiệm', 'Nhà Khoa học Môi trường'], weight: 19 },
        { value: 'nông nghiệp', careers: ['Kỹ sư Nông nghiệp', 'Quản lý Trang trại', 'Chuyên gia Công nghệ Thực phẩm'], weight: 18 },
        { value: 'pháp lý', careers: ['Luật sư', 'Trợ lý Pháp lý', 'Chuyên viên Tuân thủ', 'Tư vấn Pháp lý'], weight: 19 },
        { value: 'du lịch', careers: ['Hướng dẫn viên Du lịch', 'Tư vấn Du lịch', 'Quản lý Khách sạn'], weight: 17 },
        { value: 'ẩm thực', careers: ['Đầu bếp', 'Quản lý Nhà hàng', 'Food Technologist'], weight: 17 },
        { value: 'bất động sản', careers: ['Môi giới Bất động sản', 'Quản lý Tài sản', 'Chuyên viên Phân tích Bất động sản'], weight: 18 },
        { value: 'bán lẻ', careers: ['Quản lý Bán lẻ', 'Chuyên viên Hàng hóa', 'Giám sát Cửa hàng'], weight: 16 },
        { value: 'làm đẹp', careers: ['Chuyên viên Trang điểm', 'Nhà Tạo mẫu Tóc', 'Chuyên gia Chăm sóc Da'], weight: 17 },
        { value: 'thể thao', careers: ['Huấn luyện viên', 'Chuyên gia Thể dục', 'Chuyên viên Phân tích Thể thao'], weight: 17 },
        { value: 'giao thông vận tải', careers: ['Quản lý Vận tải', 'Chuyên gia Quy hoạch Giao thông', 'Kiểm soát viên Không lưu'], weight: 17 }
    ],

    tool_or_subject: [
        { value: 'máy tính', careers: ['Software Engineer', 'Data Analyst', 'UI Designer'], weight: 18 },
        { value: 'con người', careers: ['Giáo viên Tiểu học', 'Bác sĩ', 'Y tá / Điều dưỡng', 'Nhà Tâm lý học Lâm sàng'], weight: 19 },
        { value: 'số liệu', careers: ['Data Analyst', 'Data Scientist', 'Financial Analyst', 'Business Analyst'], weight: 20 },
        { value: 'văn bản', careers: ['Content Writer', 'Copywriter', 'Nhà báo', 'Biên kịch'], weight: 18 },
        { value: 'hình ảnh', careers: ['UI Designer', 'Graphic Designer', 'Nhiếp ảnh gia', 'Biên tập viên Video'], weight: 19 }
    ],

    problem_area: [
        { value: 'phần mềm', careers: ['Software Engineer', 'QA Engineer', 'DevOps Engineer'], weight: 20 },
        { value: 'sức khỏe', careers: ['Bác sĩ', 'Y tá / Điều dưỡng', 'Chuyên viên Dinh dưỡng'], weight: 20 },
        { value: 'kinh doanh', careers: ['Business Analyst', 'Product Manager', 'Strategy Consultant'], weight: 17 },
        { value: 'marketing', careers: ['Marketing Manager', 'SEO Specialist', 'Growth Hacker'], weight: 18 }
    ],

    work_mode: [
        { value: 'độc lập', careers: ['Software Engineer', 'Content Writer', 'Freelance Designer'], weight: 12 },
        { value: 'theo nhóm', careers: ['Project Manager', 'Product Manager', 'Scrum Master'], weight: 12 },
        { value: 'từ xa', careers: ['Software Engineer', 'Data Analyst', 'Content Writer', 'UI Designer'], weight: 10 },
        { value: 'văn phòng', careers: ['Accountant', 'HR Manager', 'Operations Manager'], weight: 8 }
    ],

    environment: [
        { value: 'năng động', careers: ['Startup Founder', 'Product Manager', 'Growth Hacker'], weight: 11 },
        { value: 'ổn định', careers: ['Accountant', 'Auditor', 'Công chức'], weight: 10 },
        { value: 'sáng tạo', careers: ['UI Designer', 'UX Designer', 'Content Creator', 'Biên kịch'], weight: 13 }
    ],

    job_activity: [
        // Tech Activities
        { value: 'viết code', careers: ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Mobile Developer', 'Full Stack Developer'], weight: 22 },
        { value: 'phân tích dữ liệu', careers: ['Data Analyst', 'Data Scientist', 'Business Analyst', 'Marketing Analyst'], weight: 22 },
        { value: 'thiết kế hệ thống', careers: ['System Architect', 'Solution Architect', 'Cloud Engineer'], weight: 20 },
        { value: 'test và debug', careers: ['QA Engineer', 'Test Engineer', 'DevOps Engineer'], weight: 19 },

        // Design & Creative
        { value: 'thiết kế giao diện', careers: ['UI Designer', 'UX Designer', 'Product Designer', 'Visual Designer'], weight: 22 },
        { value: 'viết nội dung', careers: ['Content Writer', 'Copywriter', 'Social Media Manager', 'Technical Writer'], weight: 20 },
        { value: 'chỉnh sửa video', careers: ['Biên tập viên Video', 'Video Producer', 'Motion Designer'], weight: 21 },
        { value: 'chụp ảnh', careers: ['Nhiếp ảnh gia', 'Product Photographer', 'Photo Editor'], weight: 20 },
        { value: 'vẽ và thiết kế', careers: ['Graphic Designer', 'Illustrator', 'Art Director'], weight: 21 },

        // Business & Management
        { value: 'gặp gỡ khách hàng', careers: ['Account Manager', 'Sales Manager', 'Customer Success Manager', 'Sales Executive'], weight: 20 },
        { value: 'lập kế hoạch chiến lược', careers: ['Product Manager', 'Strategy Consultant', 'Business Analyst'], weight: 19 },
        { value: 'quản lý team', careers: ['Project Manager', 'Team Lead', 'Department Manager'], weight: 18 },
        { value: 'đàm phán hợp đồng', careers: ['Sales Manager', 'Business Development', 'Account Executive'], weight: 18 },
        { value: 'phân tích thị trường', careers: ['Marketing Analyst', 'Market Researcher', 'Business Analyst'], weight: 19 },

        // Education & Healthcare
        { value: 'dạy học', careers: ['Giáo viên Tiểu học', 'Giáo viên Trung học cơ sở', 'Giảng viên Đại học / Cao đẳng', 'Gia sư / Giáo viên kèm'], weight: 22 },
        { value: 'chăm sóc bệnh nhân', careers: ['Bác sĩ', 'Y tá / Điều dưỡng', 'Vật lý trị liệu', 'Nhân viênChăm sóc sức khỏe'], weight: 22 },
        { value: 'khám và chẩn đoán', careers: ['Bác sĩ', 'Nha sĩ', 'Kỹ thuật viên Y tế'], weight: 21 },
        { value: 'tư vấn và hỗ trợ', careers: ['Nhà Tâm lý học Lâm sàng', 'Career Counselor', 'HR Business Partner'], weight: 19 },

        // Technical & Engineering
        { value: 'thiết kế kỹ thuật', careers: ['Kỹ sư Xây dựng', 'Kỹ sư Cơ khí', 'Kỹ sư Điện', 'Kiến trúc sư'], weight: 21 },
        { value: 'vận hành máy móc', careers: ['Thợ Cơ khí', 'Kỹ thuật viên', 'Thợ Điện'], weight: 19 },
        { value: 'sửa chữa và bảo dưỡng', careers: ['Thợ Điện', 'Thợ Cơ khí', 'Thợ Sửa ống nước'], weight: 19 },

        // Finance & Legal
        { value: 'phân tích tài chính', careers: ['Financial Analyst', 'Investment Analyst', 'Accountant'], weight: 20 },
        { value: 'kế toán và kiểm toán', careers: ['Accountant', 'Auditor', 'Tax Specialist'], weight: 21 },
        { value: 'tư vấn pháp lý', careers: ['Luật sư', 'Tư vấn Pháp lý', 'Chuyên viên Tuân thủ'], weight: 21 },

        // Specialized
        { value: 'nấu ăn', careers: ['Đầu bếp', 'Sous Chef', 'Pastry Chef'], weight: 22 },
        { value: 'hướng dẫn du lịch', careers: ['Hướng dẫn viên Du lịch', 'Tour Operator'], weight: 21 },
        { value: 'làm đẹp', careers: ['Chuyên viên Trang điểm', 'Nhà Tạo mẫu Tóc', 'NhânviênSpa'], weight: 20 },
        { value: 'huấn luyện thể thao', careers: ['Huấn luyện viên', 'Chuyên gia Thể dục', 'Personal Trainer'], weight: 21 }
    ],

    job_challenge: [
        { value: 'học công nghệ mới liên tục', careers: ['Software Engineer', 'Data Engineer', 'Cloud Engineer'], weight: 15 },
        { value: 'làm việc với deadline gấp', careers: ['Project Manager', 'Marketing Manager', 'Nhà báo'], weight: 12 },
        { value: 'chịu áp lực cao', careers: ['Bác sĩ', 'Trader', 'Investment Banker'], weight: 14 },
        { value: 'đi công tác thường xuyên', careers: ['Sales Manager', 'Account Manager', 'Khảo sát viên'], weight: 11 }
    ]
};

/**
 * Generate all questions from templates
 */
function generateAllQuestions() {
    const questions = [];
    let questionId = 1;

    for (const templateGroup of QUESTION_TEMPLATES) {
        for (const template of templateGroup.templates) {
            const variableName = template.variables[0];
            const mappings = VARIABLE_MAPPINGS[variableName] || [];

            for (const mapping of mappings) {
                const questionText = template.text.replace(`{${variableName}}`, mapping.value);

                // Create career-specific weights
                const careerWeights = {};
                for (const careerName of mapping.careers) {
                    careerWeights[careerName] = mapping.weight || template.weight_default;
                }

                questions.push({
                    id: `${templateGroup.id_prefix}_${questionId}`,
                    text: questionText,
                    type: template.type,
                    category: templateGroup.id_prefix,
                    variable: mapping.value,
                    career_weights: careerWeights,
                    default_weight: template.weight_default
                });

                questionId++;
            }
        }
    }

    return questions;
}

/**
 * Get weighted score for a career based on answer
 */
function getQuestionScore(question, career, answer) {
    const weight = question.career_weights[career] || 0;

    if (answer === 'yes') return weight;
    if (answer === 'maybe') return weight * 0.5;
    return 0;
}

module.exports = {
    QUESTION_TEMPLATES,
    VARIABLE_MAPPINGS,
    generateAllQuestions,
    getQuestionScore
};
