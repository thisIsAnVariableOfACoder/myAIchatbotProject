const USERS_KEY = 'offline_users_v1';
const PROFILES_KEY = 'offline_profiles_v1';
const CONVERSATIONS_KEY = 'offline_conversations_v1';
const STATE_PREFIX = 'offline_state_';
const MESSAGES_PREFIX = 'offline_messages_';
const RECS_PREFIX = 'offline_recs_';

const DEFAULT_ADMIN = { id: 1, email: 'admin@demo.local', password: 'admin123', user_type: 'admin' };

const GENERAL_QUESTIONS = [
  { id: 'g1', text: 'Bạn thích học môn nào nhất?', tags: ['education'] },
  { id: 'g2', text: 'Bạn thích làm việc với con người hay dữ liệu?', tags: ['people', 'data'] },
  { id: 'g3', text: 'Bạn có hứng thú với công nghệ hoặc lập trình không?', tags: ['technology'] },
  { id: 'g4', text: 'Bạn có thiên về sáng tạo, thiết kế hay nghệ thuật không?', tags: ['design', 'creative'] },
  { id: 'g5', text: 'Bạn quan tâm đến kinh doanh, marketing hoặc bán hàng không?', tags: ['business', 'marketing'] },
  { id: 'g6', text: 'Bạn thấy mình phù hợp môi trường y tế hoặc chăm sóc sức khỏe không?', tags: ['healthcare', 'people'] },
  { id: 'g7', text: 'Bạn có thích nghiên cứu, thí nghiệm, khoa học không?', tags: ['research', 'science'] },
  { id: 'g8', text: 'Bạn muốn công việc ổn định hay thử thách nhiều?', tags: ['values'] },
  { id: 'g9', text: 'Bạn thích làm việc hiện trường hay trong văn phòng?', tags: ['field', 'office'] },
  { id: 'g10', text: 'Bạn có hứng thú với luật, chính sách hoặc quy định không?', tags: ['legal'] },
  { id: 'g11', text: 'Bạn có thích ngoại ngữ, giao tiếp đa văn hóa không?', tags: ['language'] },
  { id: 'g12', text: 'Bạn có thích quản lý, điều phối hoặc lãnh đạo không?', tags: ['leadership'] },
  { id: 'g13', text: 'Bạn có thích làm việc với con số, tài chính hoặc kế toán không?', tags: ['finance', 'analysis'] },
  { id: 'g14', text: 'Bạn muốn công việc thiên về dịch vụ, du lịch hay chăm sóc khách hàng không?', tags: ['hospitality', 'people'] },
  { id: 'g15', text: 'Bạn quan tâm đến môi trường, nông nghiệp hoặc tài nguyên không?', tags: ['environment', 'agriculture'] },
  { id: 'g16', text: 'Bạn có thích quản trị hành chính, tổ chức hoặc công vụ không?', tags: ['public', 'administration'] },
  { id: 'g17', text: 'Bạn có thích làm việc với máy móc, hệ thống hoặc kỹ thuật không?', tags: ['engineering'] },
  { id: 'g18', text: 'Bạn muốn theo hướng truyền thông, nội dung hoặc media không?', tags: ['media', 'creative'] },
  { id: 'g19', text: 'Bạn có hứng thú với logistics, vận hành hoặc chuỗi cung ứng không?', tags: ['logistics', 'analysis'] },
  { id: 'g20', text: 'Bạn có hứng thú với xây dựng, kiến trúc hoặc bất động sản không?', tags: ['construction', 'design'] }
];

const SUBJECTS = [
  { key: 'math', label: 'Toán', tag: 'math', keywords: ['toan', 'dai so', 'hinh hoc', 'xac suat', 'thong ke'] },
  { key: 'physics', label: 'Vật lý', tag: 'physics', keywords: ['vat ly', 'co hoc', 'dien', 'quang hoc', 'nhiet hoc'] },
  { key: 'chemistry', label: 'Hóa học', tag: 'chemistry', keywords: ['hoa hoc', 'hoa', 'hoa huu co', 'hoa vo co'] },
  { key: 'literature', label: 'Ngữ văn', tag: 'literature', keywords: ['ngu van', 'van hoc', 'van'] },
  { key: 'english', label: 'Tiếng Anh', tag: 'english', keywords: ['tieng anh', 'english', 'ngoai ngu', 'ngon ngu'] },
  { key: 'biology', label: 'Sinh học', tag: 'biology', keywords: ['sinh hoc', 'sinh', 'di truyen', 'sinh ly'] },
  { key: 'history', label: 'Lịch sử', tag: 'history', keywords: ['lich su', 'su', 'di san', 'chien tranh'] },
  { key: 'geography', label: 'Địa lý', tag: 'geography', keywords: ['dia ly', 'dia chat', 'ban do', 'gis', 'khi hau'] },
  { key: 'civics', label: 'GDCD', tag: 'civics', keywords: ['gdcd', 'giao duc cong dan', 'cong dan', 'phap luat'] }
];

const SUBJECT_TOPICS = {
  math: ['đại số', 'hình học', 'xác suất', 'tổ hợp', 'giải tích', 'toán ứng dụng', 'thống kê', 'toán rời rạc'],
  physics: ['cơ học', 'điện', 'quang', 'nhiệt', 'vật lý hiện đại', 'dao động', 'điện từ', 'quang học'],
  chemistry: ['hóa hữu cơ', 'hóa vô cơ', 'phân tích', 'hóa sinh', 'hóa môi trường', 'công nghệ hóa', 'phản ứng', 'dung dịch'],
  literature: ['văn học Việt Nam', 'văn học nước ngoài', 'nghị luận', 'kỹ năng viết', 'phân tích tác phẩm', 'ngôn ngữ học', 'phê bình', 'sáng tác'],
  english: ['ngữ pháp', 'giao tiếp', 'biên phiên dịch', 'phát âm', 'tiếng Anh học thuật', 'tiếng Anh chuyên ngành', 'đọc hiểu', 'viết học thuật'],
  biology: ['di truyền', 'sinh thái', 'sinh học phân tử', 'giải phẫu', 'vi sinh', 'công nghệ sinh học', 'môi trường', 'sinh lý'],
  history: ['các triều đại', 'chiến tranh', 'lịch sử cận đại', 'lịch sử hiện đại', 'di sản', 'lịch sử văn hóa', 'lịch sử thế giới', 'nguồn sử liệu'],
  geography: ['bản đồ', 'GIS', 'địa chất', 'khí hậu', 'địa lý kinh tế', 'địa lý đô thị', 'tài nguyên', 'môi trường'],
  civics: ['pháp luật', 'đạo đức', 'quyền công dân', 'chính sách', 'xã hội', 'kinh tế', 'nhà nước', 'quản trị công']
};

const SUBJECT_TEMPLATES = [
  (subject, topic) => `Bạn có hứng thú với ${topic} trong ${subject} không?`,
  (subject, topic) => `Mức độ tự tin của bạn với ${topic} (${subject}) thế nào?`,
  (subject, topic) => `Bạn thích tìm hiểu sâu về ${topic} của ${subject} không?`,
  (subject, topic) => `Bạn muốn theo hướng ${topic} trong ${subject} chứ?`,
  (subject, topic) => `Bạn thấy ${topic} của ${subject} có hợp với mình không?`
];

const GROUP_BLUEPRINTS = [
  {
    tag: 'technology',
    label: 'Công nghệ',
    category: 'Công nghệ',
    keywords: ['cong nghe', 'lap trinh', 'it', 'phan mem', 'he thong', 'cloud', 'devops', 'an ninh mang', 'website', 'app'],
    domains: ['Phần mềm', 'Web', 'Mobile', 'Backend', 'Frontend', 'Fullstack', 'Cloud', 'DevOps', 'An ninh mạng', 'IoT', 'Game', 'Hệ thống', 'ERP', 'Blockchain'],
    roles: ['Kỹ sư', 'Lập trình viên', 'Kiến trúc sư', 'Chuyên viên', 'Quản trị', 'Tester', 'QA', 'Chuyên gia', 'Trưởng nhóm', 'Product Manager', 'Business Analyst', 'Scrum Master'],
    extraTags: ['technology', 'data', 'analysis'],
    topics: ['xây dựng ứng dụng', 'tối ưu hiệu năng', 'bảo mật hệ thống', 'vận hành hạ tầng', 'phát triển sản phẩm số', 'kiến trúc hệ thống', 'tự động hóa', 'chuyển đổi số', 'phát triển game', 'tích hợp API']
  },
  {
    tag: 'data_ai',
    label: 'Dữ liệu & AI',
    category: 'Dữ liệu & AI',
    keywords: ['du lieu', 'data', 'ai', 'tri tue nhan tao', 'machine learning', 'hoc may', 'deep learning'],
    domains: ['Phân tích dữ liệu', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'MLOps', 'Data Engineering', 'Big Data', 'BI', 'AI Product', 'AI Ethics', 'Data Governance', 'Data Visualization'],
    roles: ['Kỹ sư', 'Nhà khoa học', 'Chuyên viên', 'Phân tích', 'Kiến trúc sư', 'Kỹ thuật viên', 'Quản lý', 'Chuyên gia', 'Tư vấn', 'Giảng viên', 'Nghiên cứu viên', 'Product Manager'],
    extraTags: ['data', 'analysis', 'research'],
    topics: ['mô hình dự báo', 'học máy', 'xử lý ngôn ngữ', 'tối ưu dữ liệu', 'khai phá dữ liệu', 'MLOps', 'phân tích BI', 'đạo đức AI', 'thị giác máy tính', 'triển khai AI']
  },
  {
    tag: 'business',
    label: 'Kinh doanh',
    category: 'Kinh doanh',
    keywords: ['kinh doanh', 'ban hang', 'sales', 'khach hang', 'thuong mai', 'startup'],
    domains: ['B2B', 'B2C', 'Thương mại điện tử', 'Bán lẻ', 'Xuất nhập khẩu', 'Phát triển thị trường', 'Dịch vụ', 'Startup', 'Kênh phân phối', 'Kinh doanh quốc tế', 'Thương hiệu', 'Bất động sản'],
    roles: ['Chuyên viên', 'Quản lý', 'Giám đốc', 'Trưởng nhóm', 'Tư vấn', 'Sales', 'Account', 'Business Development', 'Chăm sóc khách hàng', 'Vận hành', 'Phân tích', 'Quản trị'],
    extraTags: ['business', 'people', 'leadership'],
    topics: ['đàm phán', 'phát triển thị trường', 'chăm sóc khách hàng', 'xây dựng chiến lược', 'quản trị doanh thu', 'quản trị kênh bán', 'khởi nghiệp', 'phân tích thị trường', 'định giá', 'tối ưu vận hành']
  },
  {
    tag: 'marketing',
    label: 'Marketing',
    category: 'Marketing',
    keywords: ['marketing', 'thuong hieu', 'quang cao', 'noi dung', 'digital', 'seo', 'pr'],
    domains: ['Digital Marketing', 'Content Marketing', 'Brand Marketing', 'Performance Marketing', 'SEO/SEM', 'PR', 'Social Media', 'Event Marketing', 'Trade Marketing', 'Growth Marketing', 'Influencer', 'Market Research'],
    roles: ['Chuyên viên', 'Quản lý', 'Giám đốc', 'Planner', 'Content', 'Copywriter', 'Strategist', 'Media Buyer', 'Analyst', 'Account', 'Community', 'Producer'],
    extraTags: ['marketing', 'creative', 'people'],
    topics: ['xây dựng thương hiệu', 'nội dung sáng tạo', 'quảng cáo số', 'phân tích hành vi', 'nghiên cứu thị trường', 'tăng trưởng người dùng', 'quan hệ công chúng', 'tổ chức sự kiện', 'truyền thông đa kênh', 'tối ưu chiến dịch']
  },
  {
    tag: 'finance',
    label: 'Tài chính',
    category: 'Tài chính',
    keywords: ['tai chinh', 'ke toan', 'kiem toan', 'ngan hang', 'dau tu'],
    domains: ['Kế toán', 'Kiểm toán', 'Ngân hàng', 'Đầu tư', 'Tài chính doanh nghiệp', 'Quản trị rủi ro', 'Chứng khoán', 'Bảo hiểm', 'Fintech', 'Thuế', 'Quỹ đầu tư', 'Tư vấn tài chính'],
    roles: ['Chuyên viên', 'Quản lý', 'Giám đốc', 'Phân tích', 'Kiểm toán viên', 'Kế toán viên', 'Tư vấn', 'Quản trị rủi ro', 'Môi giới', 'Thẩm định', 'Kiểm soát', 'Giao dịch'],
    extraTags: ['finance', 'analysis'],
    topics: ['phân tích báo cáo tài chính', 'quản trị rủi ro', 'định giá', 'quản lý dòng tiền', 'lập ngân sách', 'đầu tư', 'kiểm toán', 'tuân thủ', 'tối ưu chi phí', 'chiến lược tài chính']
  },
  {
    tag: 'healthcare',
    label: 'Y tế',
    category: 'Y tế',
    keywords: ['y te', 'suc khoe', 'bac si', 'dieu duong', 'y khoa', 'duoc'],
    domains: ['Nội khoa', 'Ngoại khoa', 'Nhi khoa', 'Dược', 'Xét nghiệm', 'Chẩn đoán hình ảnh', 'Điều dưỡng', 'Dinh dưỡng', 'Y tế cộng đồng', 'Phục hồi chức năng', 'Tâm lý', 'Quản lý bệnh viện'],
    roles: ['Bác sĩ', 'Điều dưỡng', 'Kỹ thuật viên', 'Chuyên viên', 'Quản lý', 'Dược sĩ', 'Tư vấn', 'Trị liệu', 'Giám sát', 'Nghiên cứu viên', 'Giảng viên', 'Chuyên gia'],
    extraTags: ['healthcare', 'people'],
    topics: ['chăm sóc bệnh nhân', 'dinh dưỡng', 'sức khỏe cộng đồng', 'chẩn đoán', 'xét nghiệm', 'quản lý bệnh viện', 'tư vấn sức khỏe', 'phục hồi chức năng', 'nghiên cứu y học', 'ứng dụng công nghệ y tế']
  },
  {
    tag: 'engineering',
    label: 'Kỹ thuật',
    category: 'Kỹ thuật',
    keywords: ['ky thuat', 'co khi', 'dien', 'tu dong hoa', 'robot', 'dien tu'],
    domains: ['Cơ khí', 'Điện - điện tử', 'Tự động hóa', 'Robot', 'Cơ điện tử', 'Ô tô', 'Hàng không', 'Vật liệu', 'Công nghiệp', 'Năng lượng', 'Bảo trì', 'Thiết bị'],
    roles: ['Kỹ sư', 'Kỹ thuật viên', 'Chuyên viên', 'Giám sát', 'Quản lý', 'Thiết kế', 'Bảo trì', 'Vận hành', 'Chuyên gia', 'Tư vấn', 'Trưởng nhóm', 'Giảng viên'],
    extraTags: ['engineering', 'analysis', 'field'],
    topics: ['thiết kế hệ thống', 'tối ưu vận hành', 'bảo trì thiết bị', 'tự động hóa', 'an toàn kỹ thuật', 'điều khiển', 'R&D kỹ thuật', 'tiêu chuẩn kỹ thuật', 'quản lý dự án kỹ thuật', 'năng lượng tái tạo']
  },
  {
    tag: 'design',
    label: 'Thiết kế',
    category: 'Thiết kế',
    keywords: ['thiet ke', 'ui', 'ux', 'do hoa', 'my thuat', 'san pham'],
    domains: ['UI/UX', 'Đồ họa', 'Sản phẩm', 'Thời trang', 'Nội thất', 'Kiến trúc', 'Motion', 'Branding', 'Illustration', '3D', 'Packaging', 'Game Art'],
    roles: ['Designer', 'Lead', 'Giám đốc', 'Chuyên viên', 'Art Director', 'Visual', 'Concept', 'Illustrator', 'Stylist', 'Tư vấn', 'Giảng viên', 'Chuyên gia'],
    extraTags: ['design', 'creative'],
    topics: ['nghiên cứu người dùng', 'thiết kế trải nghiệm', 'thẩm mỹ thị giác', 'thiết kế thương hiệu', 'thiết kế sản phẩm', 'thiết kế không gian', 'trình bày ý tưởng', 'tư duy sáng tạo', 'tối ưu giao diện', 'xu hướng thiết kế']
  },
  {
    tag: 'media',
    label: 'Truyền thông',
    category: 'Truyền thông',
    keywords: ['truyen thong', 'bao chi', 'noi dung', 'media', 'video', 'phim'],
    domains: ['Báo chí', 'Sản xuất nội dung', 'Video', 'Podcast', 'Truyền hình', 'Nhiếp ảnh', 'Biên tập', 'Sự kiện', 'Sáng tạo nội dung', 'Quan hệ công chúng', 'Quảng cáo', 'Sản xuất phim'],
    roles: ['Phóng viên', 'Biên tập viên', 'Producer', 'Đạo diễn', 'Chuyên viên', 'Quản lý', 'Content Creator', 'MC', 'Nhiếp ảnh gia', 'Kỹ thuật viên', 'Trưởng nhóm', 'Giám đốc'],
    extraTags: ['media', 'creative', 'people'],
    topics: ['kể chuyện', 'sản xuất nội dung', 'tổ chức sự kiện', 'truyền thông đa phương tiện', 'quan hệ công chúng', 'kịch bản', 'quay dựng', 'điều phối sản xuất', 'định hướng nội dung', 'phân phối nội dung']
  },
  {
    tag: 'logistics',
    label: 'Logistics',
    category: 'Logistics',
    keywords: ['logistics', 'chuoi cung ung', 'van hanh', 'kho', 'xuat nhap khau'],
    domains: ['Chuỗi cung ứng', 'Kho vận', 'Xuất nhập khẩu', 'Vận tải', 'Mua hàng', 'Hoạch định nhu cầu', 'Giao nhận', 'Hậu cần', 'Quản lý tồn kho', 'Tối ưu vận hành', 'Thương mại quốc tế', 'Dịch vụ logistics'],
    roles: ['Chuyên viên', 'Quản lý', 'Giám sát', 'Điều phối', 'Planner', 'Purchasing', 'Inventory', 'Warehouse', 'Operations', 'Tư vấn', 'Trưởng nhóm', 'Giám đốc'],
    extraTags: ['logistics', 'analysis', 'office'],
    topics: ['tối ưu chuỗi cung ứng', 'quản lý kho', 'vận tải', 'dự báo nhu cầu', 'quản trị tồn kho', 'đàm phán nhà cung cấp', 'thủ tục xuất nhập khẩu', 'kiểm soát chi phí', 'điều phối vận hành', 'quản lý chất lượng']
  },
  {
    tag: 'construction',
    label: 'Xây dựng',
    category: 'Xây dựng',
    keywords: ['xay dung', 'kien truc', 'bat dong san', 'cong trinh'],
    domains: ['Kết cấu', 'Kiến trúc', 'Hạ tầng', 'Bất động sản', 'Cầu đường', 'Giám sát thi công', 'Dự án', 'M&E', 'Thiết kế nội thất', 'Địa kỹ thuật', 'Quản lý công trình', 'Tư vấn xây dựng'],
    roles: ['Kỹ sư', 'Kiến trúc sư', 'Chỉ huy', 'Giám sát', 'Quản lý', 'Chuyên viên', 'Thiết kế', 'Thẩm định', 'Dự toán', 'BIM', 'Tư vấn', 'Trưởng nhóm'],
    extraTags: ['construction', 'field', 'analysis'],
    topics: ['thiết kế công trình', 'quản lý dự án', 'giám sát thi công', 'dự toán', 'an toàn lao động', 'BIM', 'quản lý chất lượng', 'quy hoạch', 'bất động sản', 'hạ tầng đô thị']
  },
  {
    tag: 'agriculture',
    label: 'Nông nghiệp',
    category: 'Nông nghiệp',
    keywords: ['nong nghiep', 'cay trong', 'chan nuoi', 'nong thon', 'thuy san'],
    domains: ['Trồng trọt', 'Chăn nuôi', 'Công nghệ nông nghiệp', 'Thủy sản', 'Lâm nghiệp', 'Nông nghiệp bền vững', 'Quản lý trang trại', 'Chế biến nông sản', 'Bảo vệ thực vật', 'Giống cây trồng', 'Đất và phân bón', 'Kỹ thuật nông nghiệp'],
    roles: ['Kỹ sư', 'Chuyên viên', 'Quản lý', 'Kỹ thuật viên', 'Tư vấn', 'Giám sát', 'Nghiên cứu viên', 'Giảng viên', 'Chuyên gia', 'Vận hành', 'Trưởng nhóm', 'Kiểm soát'],
    extraTags: ['agriculture', 'environment', 'field'],
    topics: ['nông nghiệp bền vững', 'công nghệ nông nghiệp', 'quản lý trang trại', 'chăn nuôi', 'bảo vệ thực vật', 'chế biến nông sản', 'thủy sản', 'đất và dinh dưỡng', 'giống cây trồng', 'quản lý chất lượng']
  },
  {
    tag: 'legal',
    label: 'Pháp lý',
    category: 'Pháp lý',
    keywords: ['phap ly', 'luat', 'phap luat', 'tu phap', 'tu van phap ly'],
    domains: ['Tư vấn pháp lý', 'Luật doanh nghiệp', 'Luật hình sự', 'Luật dân sự', 'Luật lao động', 'Sở hữu trí tuệ', 'Hợp đồng', 'Tuân thủ', 'Trọng tài', 'Pháp chế', 'Tố tụng', 'Thuế'],
    roles: ['Luật sư', 'Chuyên viên', 'Tư vấn', 'Trợ lý', 'Quản lý', 'Pháp chế', 'Kiểm soát', 'Giám sát', 'Thẩm phán', 'Công chứng', 'Chuyên gia', 'Giảng viên'],
    extraTags: ['legal', 'analysis'],
    topics: ['soạn thảo hợp đồng', 'tư vấn pháp luật', 'tuân thủ', 'pháp chế doanh nghiệp', 'tranh chấp', 'sở hữu trí tuệ', 'nghiên cứu văn bản', 'tố tụng', 'đàm phán pháp lý', 'quản trị rủi ro']
  },
  {
    tag: 'science',
    label: 'Khoa học',
    category: 'Khoa học',
    keywords: ['khoa hoc', 'thi nghiem', 'nghien cuu', 'phong thi nghiem'],
    domains: ['Vật lý', 'Hóa học', 'Sinh học', 'Khoa học dữ liệu', 'Khoa học vật liệu', 'Khoa học môi trường', 'Toán ứng dụng', 'Thiên văn', 'Địa chất', 'Khoa học biển', 'Nghiên cứu liên ngành', 'Khoa học giáo dục'],
    roles: ['Nhà khoa học', 'Nghiên cứu viên', 'Chuyên viên', 'Kỹ thuật viên', 'Giảng viên', 'Phân tích', 'Chuyên gia', 'Tư vấn', 'Quản lý', 'Trưởng nhóm', 'Điều phối', 'Biên tập khoa học'],
    extraTags: ['science', 'research'],
    topics: ['thiết kế thí nghiệm', 'phân tích dữ liệu', 'nghiên cứu cơ bản', 'nghiên cứu ứng dụng', 'công bố khoa học', 'hợp tác nghiên cứu', 'phương pháp khoa học', 'phòng thí nghiệm', 'mô hình hóa', 'chuyển giao công nghệ']
  },
  {
    tag: 'education',
    label: 'Giáo dục',
    category: 'Giáo dục',
    keywords: ['giao duc', 'day hoc', 'giang day', 'truong hoc', 'hieu truong'],
    domains: ['Giảng dạy', 'Quản lý giáo dục', 'EdTech', 'Khảo thí', 'Tư vấn giáo dục', 'Đào tạo doanh nghiệp', 'Chương trình học', 'Học liệu số', 'Đào tạo kỹ năng', 'Hướng nghiệp', 'Giáo dục đặc biệt', 'Giáo dục quốc tế'],
    roles: ['Giáo viên', 'Giảng viên', 'Hiệu trưởng', 'Phó hiệu trưởng', 'Chuyên viên', 'Cố vấn', 'Quản lý', 'Trợ giảng', 'Tư vấn', 'Biên soạn', 'Điều phối', 'Chuyên gia'],
    extraTags: ['education', 'people'],
    topics: ['thiết kế chương trình', 'đánh giá năng lực', 'đào tạo kỹ năng', 'quản trị trường học', 'tư vấn học tập', 'hướng nghiệp', 'học liệu số', 'đổi mới phương pháp', 'giáo dục hòa nhập', 'đào tạo doanh nghiệp']
  },
  {
    tag: 'public',
    label: 'Hành chính công',
    category: 'Hành chính công',
    keywords: ['hanh chinh', 'cong vu', 'nha nuoc', 'chinh sach', 'quan tri cong'],
    domains: ['Chính sách', 'Hành chính', 'Quản trị công', 'Phúc lợi xã hội', 'Quản lý dự án công', 'Quy hoạch', 'Tài chính công', 'Thanh tra', 'Văn thư', 'Quản lý nhân sự công', 'Cải cách hành chính', 'Dịch vụ công'],
    roles: ['Chuyên viên', 'Cán bộ', 'Quản lý', 'Thanh tra', 'Điều phối', 'Tư vấn', 'Phân tích', 'Trưởng phòng', 'Lãnh đạo', 'Giám sát', 'Kiểm soát', 'Nghiên cứu'],
    extraTags: ['public', 'administration', 'people'],
    topics: ['xây dựng chính sách', 'cải cách hành chính', 'quản trị công', 'dịch vụ công', 'phúc lợi xã hội', 'quản lý dự án công', 'giám sát', 'thanh tra', 'văn thư lưu trữ', 'tối ưu quy trình']
  },
  {
    tag: 'hospitality',
    label: 'Du lịch & Dịch vụ',
    category: 'Du lịch & Dịch vụ',
    keywords: ['du lich', 'khach san', 'nha hang', 'dich vu', 'khach hang'],
    domains: ['Khách sạn', 'Nhà hàng', 'Lữ hành', 'Hướng dẫn', 'Event', 'Resort', 'Hàng không', 'Dịch vụ cao cấp', 'Spa', 'Dịch vụ khách hàng', 'Ẩm thực', 'Du lịch trải nghiệm'],
    roles: ['Nhân viên', 'Quản lý', 'Giám sát', 'Hướng dẫn viên', 'Chuyên viên', 'Điều phối', 'Tư vấn', 'Chăm sóc khách', 'Trưởng bộ phận', 'Đầu bếp', 'Lễ tân', 'Giám đốc'],
    extraTags: ['hospitality', 'people'],
    topics: ['chăm sóc khách hàng', 'tổ chức tour', 'vận hành dịch vụ', 'quản lý khách sạn', 'ẩm thực', 'trải nghiệm khách hàng', 'tổ chức sự kiện', 'dịch vụ cao cấp', 'quản trị chất lượng', 'marketing du lịch']
  },
  {
    tag: 'environment',
    label: 'Môi trường',
    category: 'Môi trường',
    keywords: ['moi truong', 'tai nguyen', 'bien doi khi hau', 'bao ve'],
    domains: ['Quản lý môi trường', 'Biến đổi khí hậu', 'Tài nguyên nước', 'Đánh giá tác động', 'Quan trắc', 'Công nghệ môi trường', 'Năng lượng sạch', 'Bảo tồn', 'Quy hoạch môi trường', 'Giảm phát thải', 'Xử lý chất thải', 'Môi trường đô thị'],
    roles: ['Chuyên viên', 'Kỹ sư', 'Nghiên cứu viên', 'Quản lý', 'Tư vấn', 'Giám sát', 'Kỹ thuật viên', 'Điều phối', 'Chuyên gia', 'Giảng viên', 'Trưởng nhóm', 'Phân tích'],
    extraTags: ['environment', 'science', 'field'],
    topics: ['bảo vệ môi trường', 'đánh giá tác động', 'xử lý nước thải', 'quản lý chất thải', 'năng lượng sạch', 'quan trắc', 'biến đổi khí hậu', 'bảo tồn', 'môi trường đô thị', 'giảm phát thải']
  }
];

const TAG_LABELS = {
  technology: 'Công nghệ',
  data_ai: 'Dữ liệu & AI',
  business: 'Kinh doanh',
  marketing: 'Marketing',
  finance: 'Tài chính',
  healthcare: 'Y tế',
  engineering: 'Kỹ thuật',
  design: 'Thiết kế',
  media: 'Truyền thông',
  logistics: 'Logistics',
  construction: 'Xây dựng',
  agriculture: 'Nông nghiệp',
  legal: 'Pháp lý',
  science: 'Khoa học',
  education: 'Giáo dục',
  public: 'Hành chính công',
  hospitality: 'Du lịch & Dịch vụ',
  environment: 'Môi trường',
  research: 'Nghiên cứu',
  administration: 'Hành chính',
  math: 'Toán',
  physics: 'Vật lý',
  chemistry: 'Hóa học',
  literature: 'Ngữ văn',
  english: 'Tiếng Anh',
  biology: 'Sinh học',
  history: 'Lịch sử',
  geography: 'Địa lý',
  civics: 'GDCD',
  people: 'Làm việc với người',
  data: 'Dữ liệu',
  analysis: 'Phân tích',
  creative: 'Sáng tạo',
  language: 'Ngoại ngữ',
  leadership: 'Lãnh đạo',
  field: 'Hiện trường',
  office: 'Văn phòng'
};
function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function containsAny(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

function buildSubjectQuestions() {
  const pool = {};
  for (const subject of SUBJECTS) {
    const list = [];
    const topics = SUBJECT_TOPICS[subject.key] || [];
    let idx = 1;
    for (const topic of topics) {
      for (const tpl of SUBJECT_TEMPLATES) {
        list.push({
          id: `${subject.tag}_${idx++}`,
          text: tpl(subject.label, topic),
          tags: [subject.tag, 'education']
        });
      }
    }
    pool[subject.tag] = list;
  }
  return pool;
}

const SUBJECT_QUESTIONS = buildSubjectQuestions();

function buildGroupQuestions() {
  const pool = {};
  for (const group of GROUP_BLUEPRINTS) {
    const list = [];
    let idx = 1;
    for (const topic of group.topics) {
      list.push(
        { id: `${group.tag}_${idx++}`, text: `Bạn có hứng thú với ${topic} trong ngành ${group.label} không?`, tags: [group.tag] },
        { id: `${group.tag}_${idx++}`, text: `Bạn muốn theo hướng ${topic} của ${group.label} chứ?`, tags: [group.tag] },
        { id: `${group.tag}_${idx++}`, text: `Bạn có sẵn sàng học sâu về ${topic} để làm việc trong ${group.label} không?`, tags: [group.tag] },
        { id: `${group.tag}_${idx++}`, text: `Bạn thấy ${topic} có phù hợp với thế mạnh của mình không?`, tags: [group.tag] },
        { id: `${group.tag}_${idx++}`, text: `Bạn có muốn thử sức với ${topic} trong ${group.label} không?`, tags: [group.tag] }
      );
    }
    pool[group.tag] = list;
  }
  return pool;
}

const GROUP_QUESTIONS = buildGroupQuestions();





const BASE_CAREERS = [
  {
    "name": "Software Engineer",
    "category": "Technology",
    "tags": [
      "coding",
      "problem_solving",
      "sql"
    ]
  },
  {
    "name": "Frontend Developer",
    "category": "Technology",
    "tags": [
      "coding",
      "problem_solving",
      "sql"
    ]
  },
  {
    "name": "Backend Developer",
    "category": "Technology",
    "tags": [
      "coding",
      "problem_solving",
      "sql"
    ]
  },
  {
    "name": "Full Stack Developer",
    "category": "Technology",
    "tags": [
      "coding",
      "problem_solving",
      "sql"
    ]
  },
  {
    "name": "Mobile Developer",
    "category": "Technology",
    "tags": [
      "coding",
      "problem_solving",
      "sql"
    ]
  },
  {
    "name": "Game Developer",
    "category": "Technology",
    "tags": [
      "coding",
      "problem_solving",
      "sql"
    ]
  },
  {
    "name": "QA Engineer",
    "category": "Technology",
    "tags": [
      "coding",
      "problem_solving",
      "sql"
    ]
  },
  {
    "name": "DevOps Engineer",
    "category": "Technology",
    "tags": [
      "coding",
      "problem_solving",
      "sql"
    ]
  },
  {
    "name": "Cloud Engineer",
    "category": "Technology",
    "tags": [
      "coding",
      "problem_solving",
      "sql"
    ]
  },
  {
    "name": "Network Engineer",
    "category": "Technology",
    "tags": [
      "coding",
      "problem_solving",
      "sql"
    ]
  },
  {
    "name": "Cybersecurity Analyst",
    "category": "Technology",
    "tags": [
      "coding",
      "problem_solving",
      "sql"
    ]
  },
  {
    "name": "AI Engineer",
    "category": "Technology",
    "tags": [
      "coding",
      "problem_solving",
      "sql"
    ]
  },
  {
    "name": "Embedded Engineer",
    "category": "Technology",
    "tags": [
      "coding",
      "problem_solving",
      "sql"
    ]
  },
  {
    "name": "Systems Engineer",
    "category": "Technology",
    "tags": [
      "coding",
      "problem_solving",
      "sql"
    ]
  },
  {
    "name": "Site Reliability Engineer",
    "category": "Technology",
    "tags": [
      "coding",
      "problem_solving",
      "sql"
    ]
  },
  {
    "name": "IT Support",
    "category": "Technology",
    "tags": [
      "coding",
      "problem_solving",
      "sql"
    ]
  },
  {
    "name": "IT Administrator",
    "category": "Technology",
    "tags": [
      "coding",
      "problem_solving",
      "sql"
    ]
  },
  {
    "name": "Database Administrator",
    "category": "Technology",
    "tags": [
      "coding",
      "problem_solving",
      "sql"
    ]
  },
  {
    "name": "Security Engineer",
    "category": "Technology",
    "tags": [
      "coding",
      "problem_solving",
      "sql"
    ]
  },
  {
    "name": "Automation Engineer",
    "category": "Technology",
    "tags": [
      "coding",
      "problem_solving",
      "sql"
    ]
  },
  {
    "name": "Technical Support Engineer",
    "category": "Technology",
    "tags": [
      "coding",
      "problem_solving",
      "sql"
    ]
  },
  {
    "name": "Web Developer",
    "category": "Technology",
    "tags": [
      "coding",
      "problem_solving",
      "sql"
    ]
  },
  {
    "name": "System Administrator",
    "category": "Technology",
    "tags": [
      "coding",
      "problem_solving",
      "sql"
    ]
  },
  {
    "name": "IT Consultant",
    "category": "Technology",
    "tags": [
      "coding",
      "problem_solving",
      "sql"
    ]
  },
  {
    "name": "IT Project Manager",
    "category": "Technology",
    "tags": [
      "coding",
      "problem_solving",
      "sql"
    ]
  },
  {
    "name": "Data Center Engineer",
    "category": "Technology",
    "tags": [
      "coding",
      "problem_solving",
      "sql"
    ]
  },
  {
    "name": "IT Trainer",
    "category": "Technology",
    "tags": [
      "coding",
      "problem_solving",
      "sql"
    ]
  },
  {
    "name": "IT Auditor",
    "category": "Technology",
    "tags": [
      "coding",
      "problem_solving",
      "sql"
    ]
  },
  {
    "name": "IT Sales Specialist",
    "category": "Technology",
    "tags": [
      "coding",
      "problem_solving",
      "sql"
    ]
  },
  {
    "name": "IT Procurement Specialist",
    "category": "Technology",
    "tags": [
      "coding",
      "problem_solving",
      "sql"
    ]
  },
  {
    "name": "IT Business Analyst",
    "category": "Technology",
    "tags": [
      "coding",
      "problem_solving",
      "sql"
    ]
  },
  {
    "name": "IT Operations Specialist",
    "category": "Technology",
    "tags": [
      "coding",
      "problem_solving",
      "sql"
    ]
  },
  {
    "name": "IT Service Manager",
    "category": "Technology",
    "tags": [
      "coding",
      "problem_solving",
      "sql"
    ]
  },
  {
    "name": "Data Analyst",
    "category": "Data",
    "tags": [
      "statistics",
      "sql",
      "python"
    ]
  },
  {
    "name": "Data Engineer",
    "category": "Data",
    "tags": [
      "statistics",
      "sql",
      "python"
    ]
  },
  {
    "name": "Data Scientist",
    "category": "Data",
    "tags": [
      "statistics",
      "sql",
      "python"
    ]
  },
  {
    "name": "Business Intelligence Analyst",
    "category": "Data",
    "tags": [
      "statistics",
      "sql",
      "python"
    ]
  },
  {
    "name": "Data Visualization Specialist",
    "category": "Data",
    "tags": [
      "statistics",
      "sql",
      "python"
    ]
  },
  {
    "name": "Machine Learning Engineer",
    "category": "Data",
    "tags": [
      "statistics",
      "sql",
      "python"
    ]
  },
  {
    "name": "Quant Analyst",
    "category": "Data",
    "tags": [
      "statistics",
      "sql",
      "python"
    ]
  },
  {
    "name": "Research Analyst",
    "category": "Data",
    "tags": [
      "statistics",
      "sql",
      "python"
    ]
  },
  {
    "name": "Product Analyst",
    "category": "Data",
    "tags": [
      "statistics",
      "sql",
      "python"
    ]
  },
  {
    "name": "Growth Analyst",
    "category": "Data",
    "tags": [
      "statistics",
      "sql",
      "python"
    ]
  },
  {
    "name": "Analytics Engineer",
    "category": "Data",
    "tags": [
      "statistics",
      "sql",
      "python"
    ]
  },
  {
    "name": "BI Developer",
    "category": "Data",
    "tags": [
      "statistics",
      "sql",
      "python"
    ]
  },
  {
    "name": "Data Governance Specialist",
    "category": "Data",
    "tags": [
      "statistics",
      "sql",
      "python"
    ]
  },
  {
    "name": "Data Quality Analyst",
    "category": "Data",
    "tags": [
      "statistics",
      "sql",
      "python"
    ]
  },
  {
    "name": "Data Steward",
    "category": "Data",
    "tags": [
      "statistics",
      "sql",
      "python"
    ]
  },
  {
    "name": "Decision Scientist",
    "category": "Data",
    "tags": [
      "statistics",
      "sql",
      "python"
    ]
  },
  {
    "name": "UI/UX Designer",
    "category": "Design",
    "tags": [
      "design",
      "creativity",
      "user_research"
    ]
  },
  {
    "name": "Graphic Designer",
    "category": "Design",
    "tags": [
      "design",
      "creativity",
      "user_research"
    ]
  },
  {
    "name": "Product Designer",
    "category": "Design",
    "tags": [
      "design",
      "creativity",
      "user_research"
    ]
  },
  {
    "name": "UX Researcher",
    "category": "Design",
    "tags": [
      "design",
      "creativity",
      "user_research"
    ]
  },
  {
    "name": "Interaction Designer",
    "category": "Design",
    "tags": [
      "design",
      "creativity",
      "user_research"
    ]
  },
  {
    "name": "Motion Designer",
    "category": "Design",
    "tags": [
      "design",
      "creativity",
      "user_research"
    ]
  },
  {
    "name": "3D Designer",
    "category": "Design",
    "tags": [
      "design",
      "creativity",
      "user_research"
    ]
  },
  {
    "name": "Brand Designer",
    "category": "Design",
    "tags": [
      "design",
      "creativity",
      "user_research"
    ]
  },
  {
    "name": "Illustrator",
    "category": "Design",
    "tags": [
      "design",
      "creativity",
      "user_research"
    ]
  },
  {
    "name": "Game Artist",
    "category": "Design",
    "tags": [
      "design",
      "creativity",
      "user_research"
    ]
  },
  {
    "name": "Service Designer",
    "category": "Design",
    "tags": [
      "design",
      "creativity",
      "user_research"
    ]
  },
  {
    "name": "Design Systems Designer",
    "category": "Design",
    "tags": [
      "design",
      "creativity",
      "user_research"
    ]
  },
  {
    "name": "Visual Designer",
    "category": "Design",
    "tags": [
      "design",
      "creativity",
      "user_research"
    ]
  },
  {
    "name": "UX Writer",
    "category": "Design",
    "tags": [
      "design",
      "creativity",
      "user_research"
    ]
  },
  {
    "name": "Art Director",
    "category": "Design",
    "tags": [
      "design",
      "creativity",
      "user_research"
    ]
  },
  {
    "name": "Industrial Designer",
    "category": "Design",
    "tags": [
      "design",
      "creativity",
      "user_research"
    ]
  },
  {
    "name": "Packaging Designer",
    "category": "Design",
    "tags": [
      "design",
      "creativity",
      "user_research"
    ]
  },
  {
    "name": "Fashion Designer",
    "category": "Design",
    "tags": [
      "design",
      "creativity",
      "user_research"
    ]
  },
  {
    "name": "Interior Designer",
    "category": "Design",
    "tags": [
      "design",
      "creativity",
      "user_research"
    ]
  },
  {
    "name": "Web Designer",
    "category": "Design",
    "tags": [
      "design",
      "creativity",
      "user_research"
    ]
  },
  {
    "name": "Advertising Designer",
    "category": "Design",
    "tags": [
      "design",
      "creativity",
      "user_research"
    ]
  },
  {
    "name": "Animation Designer",
    "category": "Design",
    "tags": [
      "design",
      "creativity",
      "user_research"
    ]
  },
  {
    "name": "Event Designer",
    "category": "Design",
    "tags": [
      "design",
      "creativity",
      "user_research"
    ]
  },
  {
    "name": "Video Designer",
    "category": "Design",
    "tags": [
      "design",
      "creativity",
      "user_research"
    ]
  },
  {
    "name": "Sound Designer",
    "category": "Design",
    "tags": [
      "design",
      "creativity",
      "user_research"
    ]
  },
  {
    "name": "Book Designer",
    "category": "Design",
    "tags": [
      "design",
      "creativity",
      "user_research"
    ]
  },
  {
    "name": "Magazine Designer",
    "category": "Design",
    "tags": [
      "design",
      "creativity",
      "user_research"
    ]
  },
  {
    "name": "Film Designer",
    "category": "Design",
    "tags": [
      "design",
      "creativity",
      "user_research"
    ]
  },
  {
    "name": "Game Designer",
    "category": "Design",
    "tags": [
      "design",
      "creativity",
      "user_research"
    ]
  },
  {
    "name": "Business Analyst",
    "category": "Business",
    "tags": [
      "communication",
      "analysis",
      "management"
    ]
  },
  {
    "name": "Product Manager",
    "category": "Business",
    "tags": [
      "communication",
      "analysis",
      "management"
    ]
  },
  {
    "name": "Project Manager",
    "category": "Business",
    "tags": [
      "communication",
      "analysis",
      "management"
    ]
  },
  {
    "name": "Operations Manager",
    "category": "Business",
    "tags": [
      "communication",
      "analysis",
      "management"
    ]
  },
  {
    "name": "HR Specialist",
    "category": "Business",
    "tags": [
      "communication",
      "analysis",
      "management"
    ]
  },
  {
    "name": "Recruiter",
    "category": "Business",
    "tags": [
      "communication",
      "analysis",
      "management"
    ]
  },
  {
    "name": "Sales Representative",
    "category": "Business",
    "tags": [
      "communication",
      "analysis",
      "management"
    ]
  },
  {
    "name": "Account Manager",
    "category": "Business",
    "tags": [
      "communication",
      "analysis",
      "management"
    ]
  },
  {
    "name": "Customer Success",
    "category": "Business",
    "tags": [
      "communication",
      "analysis",
      "management"
    ]
  },
  {
    "name": "Business Development",
    "category": "Business",
    "tags": [
      "communication",
      "analysis",
      "management"
    ]
  },
  {
    "name": "Office Manager",
    "category": "Business",
    "tags": [
      "communication",
      "analysis",
      "management"
    ]
  },
  {
    "name": "Procurement Specialist",
    "category": "Business",
    "tags": [
      "communication",
      "analysis",
      "management"
    ]
  },
  {
    "name": "Strategy Analyst",
    "category": "Business",
    "tags": [
      "communication",
      "analysis",
      "management"
    ]
  },
  {
    "name": "Operations Analyst",
    "category": "Business",
    "tags": [
      "communication",
      "analysis",
      "management"
    ]
  },
  {
    "name": "Management Consultant",
    "category": "Business",
    "tags": [
      "communication",
      "analysis",
      "management"
    ]
  },
  {
    "name": "Customer Experience Manager",
    "category": "Business",
    "tags": [
      "communication",
      "analysis",
      "management"
    ]
  },
  {
    "name": "Supply Chain Manager",
    "category": "Business",
    "tags": [
      "communication",
      "analysis",
      "management"
    ]
  },
  {
    "name": "CEO",
    "category": "Business",
    "tags": [
      "communication",
      "analysis",
      "management"
    ]
  },
  {
    "name": "CFO",
    "category": "Business",
    "tags": [
      "communication",
      "analysis",
      "management"
    ]
  },
  {
    "name": "CMO",
    "category": "Business",
    "tags": [
      "communication",
      "analysis",
      "management"
    ]
  },
  {
    "name": "CHRO",
    "category": "Business",
    "tags": [
      "communication",
      "analysis",
      "management"
    ]
  },
  {
    "name": "Sales Manager",
    "category": "Business",
    "tags": [
      "communication",
      "analysis",
      "management"
    ]
  },
  {
    "name": "HR Manager",
    "category": "Business",
    "tags": [
      "communication",
      "analysis",
      "management"
    ]
  },
  {
    "name": "Marketing Manager",
    "category": "Business",
    "tags": [
      "communication",
      "analysis",
      "management"
    ]
  },
  {
    "name": "Market Development Specialist",
    "category": "Business",
    "tags": [
      "communication",
      "analysis",
      "management"
    ]
  },
  {
    "name": "Business Data Analyst",
    "category": "Business",
    "tags": [
      "communication",
      "analysis",
      "management"
    ]
  },
  {
    "name": "Supply Chain Specialist",
    "category": "Business",
    "tags": [
      "communication",
      "analysis",
      "management"
    ]
  },
  {
    "name": "Risk Manager",
    "category": "Business",
    "tags": [
      "communication",
      "analysis",
      "management"
    ]
  },
  {
    "name": "Quality Manager",
    "category": "Business",
    "tags": [
      "communication",
      "analysis",
      "management"
    ]
  },
  {
    "name": "Customer Manager",
    "category": "Business",
    "tags": [
      "communication",
      "analysis",
      "management"
    ]
  },
  {
    "name": "Finance Manager",
    "category": "Business",
    "tags": [
      "communication",
      "analysis",
      "management"
    ]
  },
  {
    "name": "Strategy Manager",
    "category": "Business",
    "tags": [
      "communication",
      "analysis",
      "management"
    ]
  },
  {
    "name": "Brand Manager",
    "category": "Business",
    "tags": [
      "communication",
      "analysis",
      "management"
    ]
  },
  {
    "name": "Sales Specialist",
    "category": "Business",
    "tags": [
      "communication",
      "analysis",
      "management"
    ]
  },
  {
    "name": "Contract Manager",
    "category": "Business",
    "tags": [
      "communication",
      "analysis",
      "management"
    ]
  },
  {
    "name": "Purchasing Manager",
    "category": "Business",
    "tags": [
      "communication",
      "analysis",
      "management"
    ]
  },
  {
    "name": "Marketing Specialist",
    "category": "Marketing",
    "tags": [
      "communication",
      "creativity",
      "analytics"
    ]
  },
  {
    "name": "SEO Specialist",
    "category": "Marketing",
    "tags": [
      "communication",
      "creativity",
      "analytics"
    ]
  },
  {
    "name": "Social Media Manager",
    "category": "Marketing",
    "tags": [
      "communication",
      "creativity",
      "analytics"
    ]
  },
  {
    "name": "Content Creator",
    "category": "Marketing",
    "tags": [
      "communication",
      "creativity",
      "analytics"
    ]
  },
  {
    "name": "Copywriter",
    "category": "Marketing",
    "tags": [
      "communication",
      "creativity",
      "analytics"
    ]
  },
  {
    "name": "Performance Marketer",
    "category": "Marketing",
    "tags": [
      "communication",
      "creativity",
      "analytics"
    ]
  },
  {
    "name": "PR Specialist",
    "category": "Marketing",
    "tags": [
      "communication",
      "creativity",
      "analytics"
    ]
  },
  {
    "name": "Community Manager",
    "category": "Marketing",
    "tags": [
      "communication",
      "creativity",
      "analytics"
    ]
  },
  {
    "name": "Event Planner",
    "category": "Marketing",
    "tags": [
      "communication",
      "creativity",
      "analytics"
    ]
  },
  {
    "name": "Growth Marketer",
    "category": "Marketing",
    "tags": [
      "communication",
      "creativity",
      "analytics"
    ]
  },
  {
    "name": "CRM Specialist",
    "category": "Marketing",
    "tags": [
      "communication",
      "creativity",
      "analytics"
    ]
  },
  {
    "name": "Email Marketing Specialist",
    "category": "Marketing",
    "tags": [
      "communication",
      "creativity",
      "analytics"
    ]
  },
  {
    "name": "Marketing Analyst",
    "category": "Marketing",
    "tags": [
      "communication",
      "creativity",
      "analytics"
    ]
  },
  {
    "name": "Influencer Manager",
    "category": "Marketing",
    "tags": [
      "communication",
      "creativity",
      "analytics"
    ]
  },
  {
    "name": "Brand Strategist",
    "category": "Marketing",
    "tags": [
      "communication",
      "creativity",
      "analytics"
    ]
  },
  {
    "name": "Financial Analyst",
    "category": "Finance",
    "tags": [
      "analysis",
      "excel",
      "finance"
    ]
  },
  {
    "name": "Accountant",
    "category": "Finance",
    "tags": [
      "analysis",
      "excel",
      "finance"
    ]
  },
  {
    "name": "Auditor",
    "category": "Finance",
    "tags": [
      "analysis",
      "excel",
      "finance"
    ]
  },
  {
    "name": "Tax Specialist",
    "category": "Finance",
    "tags": [
      "analysis",
      "excel",
      "finance"
    ]
  },
  {
    "name": "Investment Analyst",
    "category": "Finance",
    "tags": [
      "analysis",
      "excel",
      "finance"
    ]
  },
  {
    "name": "Risk Analyst",
    "category": "Finance",
    "tags": [
      "analysis",
      "excel",
      "finance"
    ]
  },
  {
    "name": "Treasury Specialist",
    "category": "Finance",
    "tags": [
      "analysis",
      "excel",
      "finance"
    ]
  },
  {
    "name": "Credit Analyst",
    "category": "Finance",
    "tags": [
      "analysis",
      "excel",
      "finance"
    ]
  },
  {
    "name": "Insurance Specialist",
    "category": "Finance",
    "tags": [
      "analysis",
      "excel",
      "finance"
    ]
  },
  {
    "name": "Financial Planner",
    "category": "Finance",
    "tags": [
      "analysis",
      "excel",
      "finance"
    ]
  },
  {
    "name": "Investment Banker",
    "category": "Finance",
    "tags": [
      "analysis",
      "excel",
      "finance"
    ]
  },
  {
    "name": "Actuary",
    "category": "Finance",
    "tags": [
      "analysis",
      "excel",
      "finance"
    ]
  },
  {
    "name": "Giáo viên Tiểu học",
    "category": "Education",
    "tags": [
      "teaching",
      "communication",
      "subject_knowledge"
    ]
  },
  {
    "name": "Giáo viên Trung học cơ sở",
    "category": "Education",
    "tags": [
      "teaching",
      "communication",
      "subject_knowledge"
    ]
  },
  {
    "name": "Giáo viên Trung học phổ thông",
    "category": "Education",
    "tags": [
      "teaching",
      "communication",
      "subject_knowledge"
    ]
  },
  {
    "name": "Giảng viên Đại học / Cao đẳng",
    "category": "Education",
    "tags": [
      "teaching",
      "communication",
      "subject_knowledge"
    ]
  },
  {
    "name": "Giáo viên Đào tạo nghề",
    "category": "Education",
    "tags": [
      "teaching",
      "communication",
      "subject_knowledge"
    ]
  },
  {
    "name": "Giáo viên Giáo dục đặc biệt",
    "category": "Education",
    "tags": [
      "teaching",
      "communication",
      "subject_knowledge"
    ]
  },
  {
    "name": "Gia sư / Giáo viên kèm",
    "category": "Education",
    "tags": [
      "teaching",
      "communication",
      "subject_knowledge"
    ]
  },
  {
    "name": "Bác sĩ",
    "category": "Healthcare",
    "tags": [
      "care",
      "communication",
      "medical"
    ]
  },
  {
    "name": "Y tá / Điều dưỡng",
    "category": "Healthcare",
    "tags": [
      "care",
      "communication",
      "medical"
    ]
  },
  {
    "name": "Dược sĩ",
    "category": "Healthcare",
    "tags": [
      "care",
      "communication",
      "medical"
    ]
  },
  {
    "name": "Nha sĩ",
    "category": "Healthcare",
    "tags": [
      "care",
      "communication",
      "medical"
    ]
  },
  {
    "name": "Kỹ thuật viên Y tế",
    "category": "Healthcare",
    "tags": [
      "care",
      "communication",
      "medical"
    ]
  },
  {
    "name": "Nhân viên Chăm sóc sức khỏe",
    "category": "Healthcare",
    "tags": [
      "care",
      "communication",
      "medical"
    ]
  },
  {
    "name": "Nhà Tâm lý học Lâm sàng",
    "category": "Healthcare",
    "tags": [
      "care",
      "communication",
      "medical"
    ]
  },
  {
    "name": "Vật lý trị liệu",
    "category": "Healthcare",
    "tags": [
      "care",
      "communication",
      "medical"
    ]
  },
  {
    "name": "Chuyên viên Dinh dưỡng",
    "category": "Healthcare",
    "tags": [
      "care",
      "communication",
      "medical"
    ]
  },
  {
    "name": "Quản lý Y tế",
    "category": "Healthcare",
    "tags": [
      "care",
      "communication",
      "medical"
    ]
  },
  {
    "name": "Kỹ sư Xây dựng",
    "category": "Engineering",
    "tags": [
      "math",
      "physics",
      "design"
    ]
  },
  {
    "name": "Kỹ sư Cơ khí",
    "category": "Engineering",
    "tags": [
      "math",
      "physics",
      "design"
    ]
  },
  {
    "name": "Kỹ sư Điện",
    "category": "Engineering",
    "tags": [
      "math",
      "physics",
      "design"
    ]
  },
  {
    "name": "Kỹ sư Công nghiệp",
    "category": "Engineering",
    "tags": [
      "math",
      "physics",
      "design"
    ]
  },
  {
    "name": "Kỹ sư Tự động hóa",
    "category": "Engineering",
    "tags": [
      "math",
      "physics",
      "design"
    ]
  },
  {
    "name": "Kiến trúc sư",
    "category": "Engineering",
    "tags": [
      "math",
      "physics",
      "design"
    ]
  },
  {
    "name": "Kỹ sư Hóa học",
    "category": "Engineering",
    "tags": [
      "math",
      "physics",
      "design"
    ]
  },
  {
    "name": "Kỹ sư Môi trường",
    "category": "Engineering",
    "tags": [
      "math",
      "physics",
      "design"
    ]
  },
  {
    "name": "Kỹ sư Năng lượng",
    "category": "Engineering",
    "tags": [
      "math",
      "physics",
      "design"
    ]
  },
  {
    "name": "Luật sư",
    "category": "Legal",
    "tags": [
      "writing",
      "analysis",
      "research"
    ]
  },
  {
    "name": "Trợ lý Pháp lý",
    "category": "Legal",
    "tags": [
      "writing",
      "analysis",
      "research"
    ]
  },
  {
    "name": "Chuyên viên Tuân thủ",
    "category": "Legal",
    "tags": [
      "writing",
      "analysis",
      "research"
    ]
  },
  {
    "name": "Tư vấn Pháp lý",
    "category": "Legal",
    "tags": [
      "writing",
      "analysis",
      "research"
    ]
  },
  {
    "name": "Chuyên viên Hợp đồng",
    "category": "Legal",
    "tags": [
      "writing",
      "analysis",
      "research"
    ]
  },
  {
    "name": "Quản lý Khách sạn",
    "category": "Hospitality",
    "tags": [
      "service",
      "communication",
      "organization"
    ]
  },
  {
    "name": "Hướng dẫn viên Du lịch",
    "category": "Hospitality",
    "tags": [
      "service",
      "communication",
      "organization"
    ]
  },
  {
    "name": "Đầu bếp",
    "category": "Hospitality",
    "tags": [
      "service",
      "communication",
      "organization"
    ]
  },
  {
    "name": "Quản lý Nhà hàng",
    "category": "Hospitality",
    "tags": [
      "service",
      "communication",
      "organization"
    ]
  },
  {
    "name": "Tư vấn Du lịch",
    "category": "Hospitality",
    "tags": [
      "service",
      "communication",
      "organization"
    ]
  },
  {
    "name": "Điều phối Sự kiện",
    "category": "Hospitality",
    "tags": [
      "service",
      "communication",
      "organization"
    ]
  },
  {
    "name": "Chuyên viên Chuỗi cung ứng",
    "category": "Logistics",
    "tags": [
      "analysis",
      "process",
      "organization"
    ]
  },
  {
    "name": "Điều phối Logistics",
    "category": "Logistics",
    "tags": [
      "analysis",
      "process",
      "organization"
    ]
  },
  {
    "name": "Quản lý Kho",
    "category": "Logistics",
    "tags": [
      "analysis",
      "process",
      "organization"
    ]
  },
  {
    "name": "Chuyên viên Hải quan",
    "category": "Logistics",
    "tags": [
      "analysis",
      "process",
      "organization"
    ]
  },
  {
    "name": "Quản lý Vận tải",
    "category": "Logistics",
    "tags": [
      "analysis",
      "process",
      "organization"
    ]
  },
  {
    "name": "Nhà báo",
    "category": "Media",
    "tags": [
      "storytelling",
      "editing",
      "creativity"
    ]
  },
  {
    "name": "Biên tập viên Video",
    "category": "Media",
    "tags": [
      "storytelling",
      "editing",
      "creativity"
    ]
  },
  {
    "name": "Nhiếp ảnh gia",
    "category": "Media",
    "tags": [
      "storytelling",
      "editing",
      "creativity"
    ]
  },
  {
    "name": "Nhà sản xuất Truyền thông",
    "category": "Media",
    "tags": [
      "storytelling",
      "editing",
      "creativity"
    ]
  },
  {
    "name": "Chuyên gia Nội dung",
    "category": "Media",
    "tags": [
      "storytelling",
      "editing",
      "creativity"
    ]
  },
  {
    "name": "Nhà sản xuất Podcast",
    "category": "Media",
    "tags": [
      "storytelling",
      "editing",
      "creativity"
    ]
  },
  {
    "name": "Họa sĩ Hoạt hình",
    "category": "Media",
    "tags": [
      "storytelling",
      "editing",
      "creativity"
    ]
  },
  {
    "name": "Biên kịch",
    "category": "Media",
    "tags": [
      "storytelling",
      "editing",
      "creativity"
    ]
  },
  {
    "name": "Chuyên gia PR",
    "category": "Media",
    "tags": [
      "storytelling",
      "editing",
      "creativity"
    ]
  },
  {
    "name": "Quản lý Truyền thông Xã hội",
    "category": "Media",
    "tags": [
      "storytelling",
      "editing",
      "creativity"
    ]
  },
  {
    "name": "Chuyên viên Chính sách",
    "category": "Government",
    "tags": [
      "policy",
      "communication",
      "analysis"
    ]
  },
  {
    "name": "Công chức",
    "category": "Government",
    "tags": [
      "policy",
      "communication",
      "analysis"
    ]
  },
  {
    "name": "Nhà Ngoại giao",
    "category": "Government",
    "tags": [
      "policy",
      "communication",
      "analysis"
    ]
  },
  {
    "name": "Quy hoạch Đô thị",
    "category": "Government",
    "tags": [
      "policy",
      "communication",
      "analysis"
    ]
  },
  {
    "name": "Nhà Nghiên cứu Khoa học",
    "category": "Science",
    "tags": [
      "research",
      "analysis",
      "lab"
    ]
  },
  {
    "name": "Kỹ thuật viên Phòng thí nghiệm",
    "category": "Science",
    "tags": [
      "research",
      "analysis",
      "lab"
    ]
  },
  {
    "name": "Nhà Khoa học Môi trường",
    "category": "Science",
    "tags": [
      "research",
      "analysis",
      "lab"
    ]
  },
  {
    "name": "Nhà Khoa học Thực phẩm",
    "category": "Science",
    "tags": [
      "research",
      "analysis",
      "lab"
    ]
  },
  {
    "name": "Thợ Điện",
    "category": "Trades",
    "tags": [
      "hands_on",
      "precision",
      "safety"
    ]
  },
  {
    "name": "Thợ Cơ khí",
    "category": "Trades",
    "tags": [
      "hands_on",
      "precision",
      "safety"
    ]
  },
  {
    "name": "Thợ Sửa ống nước",
    "category": "Trades",
    "tags": [
      "hands_on",
      "precision",
      "safety"
    ]
  },
  {
    "name": "Thợ Mộc",
    "category": "Trades",
    "tags": [
      "hands_on",
      "precision",
      "safety"
    ]
  },
  {
    "name": "Thợ Hàn",
    "category": "Trades",
    "tags": [
      "hands_on",
      "precision",
      "safety"
    ]
  },
  {
    "name": "Kỹ thuật viên",
    "category": "Trades",
    "tags": [
      "hands_on",
      "precision",
      "safety"
    ]
  },
  {
    "name": "Thợ Sơn",
    "category": "Trades",
    "tags": [
      "hands_on",
      "precision",
      "safety"
    ]
  },
  {
    "name": "Kỹ sư Nông nghiệp",
    "category": "Agriculture",
    "tags": [
      "biology",
      "process",
      "care"
    ]
  },
  {
    "name": "Quản lý Trang trại",
    "category": "Agriculture",
    "tags": [
      "biology",
      "process",
      "care"
    ]
  },
  {
    "name": "Chuyên gia Công nghệ Thực phẩm",
    "category": "Agriculture",
    "tags": [
      "biology",
      "process",
      "care"
    ]
  },
  {
    "name": "Trợ lý Thú y",
    "category": "Agriculture",
    "tags": [
      "biology",
      "process",
      "care"
    ]
  },
  {
    "name": "Chuyên viên An toàn Thực phẩm",
    "category": "Agriculture",
    "tags": [
      "biology",
      "process",
      "care"
    ]
  },
  {
    "name": "Môi giới Bất động sản",
    "category": "RealEstate",
    "tags": [
      "sales",
      "communication",
      "negotiation"
    ]
  },
  {
    "name": "Quản lý Tài sản",
    "category": "RealEstate",
    "tags": [
      "sales",
      "communication",
      "negotiation"
    ]
  },
  {
    "name": "Chuyên viên Phân tích Bất động sản",
    "category": "RealEstate",
    "tags": [
      "sales",
      "communication",
      "negotiation"
    ]
  },
  {
    "name": "Tư vấn Cho thuê",
    "category": "RealEstate",
    "tags": [
      "sales",
      "communication",
      "negotiation"
    ]
  },
  {
    "name": "Quản lý Bán lẻ",
    "category": "Retail",
    "tags": [
      "service",
      "sales",
      "organization"
    ]
  },
  {
    "name": "Chuyên viên Hàng hóa",
    "category": "Retail",
    "tags": [
      "service",
      "sales",
      "organization"
    ]
  },
  {
    "name": "Giám sát Cửa hàng",
    "category": "Retail",
    "tags": [
      "service",
      "sales",
      "organization"
    ]
  },
  {
    "name": "Quản lý Tồn kho",
    "category": "Retail",
    "tags": [
      "service",
      "sales",
      "organization"
    ]
  },
  {
    "name": "Quản lý Thương mại điện tử",
    "category": "Retail",
    "tags": [
      "service",
      "sales",
      "organization"
    ]
  },
  {
    "name": "Chuyên viên Trang điểm",
    "category": "Beauty",
    "tags": [
      "aesthetics",
      "service",
      "communication"
    ]
  },
  {
    "name": "Nhà Tạo mẫu Tóc",
    "category": "Beauty",
    "tags": [
      "aesthetics",
      "service",
      "communication"
    ]
  },
  {
    "name": "Chuyên gia Chăm sóc Da",
    "category": "Beauty",
    "tags": [
      "aesthetics",
      "service",
      "communication"
    ]
  },
  {
    "name": "Nhân viên Spa",
    "category": "Beauty",
    "tags": [
      "aesthetics",
      "service",
      "communication"
    ]
  },
  {
    "name": "Huấn luyện viên",
    "category": "Sports",
    "tags": [
      "discipline",
      "training",
      "teamwork"
    ]
  },
  {
    "name": "Chuyên gia Thể dục",
    "category": "Sports",
    "tags": [
      "discipline",
      "training",
      "teamwork"
    ]
  },
  {
    "name": "Chuyên viên Phân tích Thể thao",
    "category": "Sports",
    "tags": [
      "discipline",
      "training",
      "teamwork"
    ]
  },
  {
    "name": "Chuyền gia Dinh dưỡng Thể thao",
    "category": "Sports",
    "tags": [
      "discipline",
      "training",
      "teamwork"
    ]
  },
  {
    "name": "Chuyên gia Quy hoạch Giao thông",
    "category": "Transportation",
    "tags": [
      "safety",
      "operations",
      "navigation"
    ]
  },
  {
    "name": "Kiểm soát viên Không lưu",
    "category": "Transportation",
    "tags": [
      "safety",
      "operations",
      "navigation"
    ]
  },
  {
    "name": "Nhân viên Điều hành Bay",
    "category": "Transportation",
    "tags": [
      "safety",
      "operations",
      "navigation"
    ]
  },
  {
    "name": "Quản lý Xây dựng",
    "category": "Construction",
    "tags": [
      "planning",
      "safety",
      "execution"
    ]
  },
  {
    "name": "Kỹ sư Công trường",
    "category": "Construction",
    "tags": [
      "planning",
      "safety",
      "execution"
    ]
  },
  {
    "name": "Khảo sát viên",
    "category": "Construction",
    "tags": [
      "planning",
      "safety",
      "execution"
    ]
  },
  {
    "name": "Chuyên viên An toàn Xây dựng",
    "category": "Construction",
    "tags": [
      "planning",
      "safety",
      "execution"
    ]
  },
  {
    "name": "Kỹ sư Kết cấu",
    "category": "Construction",
    "tags": [
      "planning",
      "safety",
      "execution"
    ]
  }
];

const CAREERS = BASE_CAREERS;

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getUsers() {
  const users = readJson(USERS_KEY, []);
  if (!users.find((u) => u.email === DEFAULT_ADMIN.email)) {
    users.push(DEFAULT_ADMIN);
    writeJson(USERS_KEY, users);
  }
  return users;
}

function saveUsers(users) {
  writeJson(USERS_KEY, users);
}

function getProfiles() {
  return readJson(PROFILES_KEY, {});
}

function saveProfiles(profiles) {
  writeJson(PROFILES_KEY, profiles);
}

function getConversations() {
  return readJson(CONVERSATIONS_KEY, []);
}

function saveConversations(conversations) {
  writeJson(CONVERSATIONS_KEY, conversations);
}

function getState(conversationId) {
  return readJson(`${STATE_PREFIX}${conversationId}`, {
    index: 0,
    generalIndex: 0,
    focusIndex: 0,
    focusCount: 0,
    focusTag: null,
    focusType: null,
    lastQuestionTags: [],
    answers: [],
    tags: {}
  });
}

function saveState(conversationId, state) {
  writeJson(`${STATE_PREFIX}${conversationId}`, state);
}

function getMessages(conversationId) {
  return readJson(`${MESSAGES_PREFIX}${conversationId}`, []);
}

function saveMessages(conversationId, messages) {
  writeJson(`${MESSAGES_PREFIX}${conversationId}`, messages);
}

function getRecommendations(conversationId) {
  return readJson(`${RECS_PREFIX}${conversationId}`, []);
}

function saveRecommendations(conversationId, recs) {
  writeJson(`${RECS_PREFIX}${conversationId}`, recs);
}

function ensureConversation(conversationId, userId, message) {
  const conversations = getConversations();
  let conv = conversations.find((c) => c.conversation_id === conversationId);
  if (!conv) {
    const title = (message || '').trim() || `Cuộc trò chuyện ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`;
    conv = {
      conversation_id: conversationId,
      title,
      user_id: userId || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    conversations.unshift(conv);
  } else {
    conv.updated_at = new Date().toISOString();
  }
  saveConversations(conversations);
  return conv;
}

function updateConversationTitle(conversationId, title) {
  const conversations = getConversations();
  const conv = conversations.find((c) => c.conversation_id === conversationId);
  if (conv) {
    conv.title = title;
    conv.updated_at = new Date().toISOString();
    saveConversations(conversations);
  }
}

function removeConversation(conversationId) {
  const conversations = getConversations().filter((c) => c.conversation_id !== conversationId);
  saveConversations(conversations);
  localStorage.removeItem(`${MESSAGES_PREFIX}${conversationId}`);
  localStorage.removeItem(`${RECS_PREFIX}${conversationId}`);
  localStorage.removeItem(`${STATE_PREFIX}${conversationId}`);
}

function clearHistoryForUser(userId) {
  const conversations = getConversations().filter((c) => c.user_id !== userId);
  saveConversations(conversations);
}
function detectSubjectTag(text) {
  const lower = normalizeText(text);
  for (const subject of SUBJECTS) {
    if (containsAny(lower, subject.keywords)) {
      return subject.tag;
    }
  }
  return null;
}

function detectGroupTag(text) {
  const lower = normalizeText(text);
  for (const group of GROUP_BLUEPRINTS) {
    const keywords = group.keywords.map((k) => normalizeText(k));
    if (containsAny(lower, keywords)) {
      return group.tag;
    }
  }
  return null;
}

function addTagScore(tags, tag, delta = 1) {
  if (!tag) return;
  tags[tag] = (tags[tag] || 0) + delta;
}

function detectAnswerTone(text) {
  const lower = normalizeText(text);
  const positive = ['co the', 'thich', 'muon', 'yeu thich', 'ok', 'dong y', 'tu tin', 'quan tam', 'yes'];
  const negative = ['khong', 'ko', 'chua', 'khong thich', 'khong muon', 'khong hop'];
  if (containsAny(lower, positive)) return 1;
  if (containsAny(lower, negative)) return -1;
  return 0;
}

function deriveTags(text) {
  const lower = normalizeText(text);
  const tags = {};

  const keywordTags = [
    { tag: 'technology', keywords: ['cong nghe', 'lap trinh', 'it', 'phan mem', 'he thong', 'app', 'website'] },
    { tag: 'data_ai', keywords: ['du lieu', 'data', 'ai', 'hoc may', 'machine learning', 'deep learning'] },
    { tag: 'business', keywords: ['kinh doanh', 'ban hang', 'sales', 'thuong mai'] },
    { tag: 'marketing', keywords: ['marketing', 'thuong hieu', 'quang cao', 'seo', 'noi dung'] },
    { tag: 'finance', keywords: ['tai chinh', 'ke toan', 'kiem toan', 'ngan hang'] },
    { tag: 'healthcare', keywords: ['y te', 'suc khoe', 'bac si', 'dieu duong', 'duoc'] },
    { tag: 'engineering', keywords: ['ky thuat', 'co khi', 'dien', 'tu dong hoa', 'robot'] },
    { tag: 'design', keywords: ['thiet ke', 'ui', 'ux', 'do hoa', 'my thuat'] },
    { tag: 'media', keywords: ['truyen thong', 'bao chi', 'media', 'video', 'phim'] },
    { tag: 'logistics', keywords: ['logistics', 'chuoi cung ung', 'kho', 'van tai'] },
    { tag: 'construction', keywords: ['xay dung', 'kien truc', 'bat dong san', 'cong trinh'] },
    { tag: 'agriculture', keywords: ['nong nghiep', 'cay trong', 'chan nuoi', 'thuy san'] },
    { tag: 'legal', keywords: ['luat', 'phap ly', 'phap luat'] },
    { tag: 'science', keywords: ['khoa hoc', 'thi nghiem', 'nghien cuu'] },
    { tag: 'research', keywords: ['nghien cuu', 'R&D', 'research'] },
    { tag: 'education', keywords: ['giao duc', 'day hoc', 'giang day', 'truong hoc'] },
    { tag: 'public', keywords: ['hanh chinh', 'cong vu', 'chinh sach'] },
    { tag: 'administration', keywords: ['hanh chinh', 'quan tri hanh chinh'] },
    { tag: 'hospitality', keywords: ['du lich', 'khach san', 'nha hang', 'dich vu'] },
    { tag: 'environment', keywords: ['moi truong', 'tai nguyen', 'bien doi khi hau'] },
    { tag: 'people', keywords: ['giao tiep', 'khach hang', 'phuc vu', 'con nguoi'] },
    { tag: 'data', keywords: ['du lieu', 'so lieu', 'phan tich', 'thong ke'] },
    { tag: 'analysis', keywords: ['phan tich', 'logic', 'so lieu'] },
    { tag: 'creative', keywords: ['sang tao', 'nghe thuat', 'y tuong'] },
    { tag: 'language', keywords: ['ngoai ngu', 'tieng anh', 'ngon ngu'] },
    { tag: 'leadership', keywords: ['lanh dao', 'quan ly', 'dieu phoi'] },
    { tag: 'field', keywords: ['hien truong', 'di chuyen', 'cong trinh'] },
    { tag: 'office', keywords: ['van phong', 'giay to', 'ban giay'] }
  ];

  for (const item of keywordTags) {
    if (containsAny(lower, item.keywords)) {
      tags[item.tag] = 1;
    }
  }

  const subjectTag = detectSubjectTag(lower);
  if (subjectTag) tags[subjectTag] = 1;

  const groupTag = detectGroupTag(lower);
  if (groupTag) tags[groupTag] = 1;

  return tags;
}

function pickNextQuestion(state) {
  const profile = state.userProfile || {};
  const userType = profile.education_level || 'high_school';

  // High School: Focus on subjects first
  if (userType === 'high_school') {
    // If we haven't asked enough subject questions (e.g., first 5 questions)
    if (state.answers.length < 5) {
      // Pick a random subject question we haven't asked clearly yet
      // This is a simplified logic; ideally we should track asked questions better
      const subjectIndex = state.answers.length % SUBJECTS.length;
      const subj = SUBJECTS[subjectIndex];
      const template = SUBJECT_TEMPLATES[state.answers.length % SUBJECT_TEMPLATES.length];
      // Create a dynamic question object
      return {
        id: `subj_${subj.key}_${Date.now()}`,
        text: template(subj.label, SUBJECT_TOPICS[subj.key][0]), // Pick first topic for simplicity or random
        tags: [subj.tag, 'education']
      };
    }
  }

  // University/Professional: Focus on groups/industries
  if (userType === 'university' || userType === 'professional') {
    if (state.answers.length < 4) {
      const groupIndex = state.answers.length % GROUP_BLUEPRINTS.length;
      const group = GROUP_BLUEPRINTS[groupIndex];
      return {
        id: `group_${group.tag}_${Date.now()}`,
        text: `Bạn có hứng thú với lĩnh vực ${group.label} (${group.keywords.slice(0, 2).join(', ')}) không?`,
        tags: [group.tag, 'career_group']
      };
    }
  }

  const focusTag = state.focusTag;
  const focusType = state.focusType;
  let focusPool = null;

  if (focusTag && focusType === 'subject') {
    focusPool = SUBJECT_QUESTIONS[focusTag] || null;
  } else if (focusTag && focusType === 'group') {
    focusPool = GROUP_QUESTIONS[focusTag] || null;
  }

  const shouldUseFocus = focusPool && focusPool.length > 0 && (state.focusCount % 4 !== 3);

  if (shouldUseFocus) {
    const q = focusPool[state.focusIndex % focusPool.length];
    state.focusIndex += 1;
    state.focusCount += 1;
    state.lastQuestionTags = q.tags || [];
    state.lastQuestionText = q.text; // Store for LLM context
    return q;
  }

  const q = GENERAL_QUESTIONS[state.generalIndex % GENERAL_QUESTIONS.length];
  state.generalIndex += 1;
  state.lastQuestionTags = q.tags || [];
  state.lastQuestionText = q.text; // Store for LLM context
  return q;
}

function buildReasons(career, tags, focusTag) {
  const reasons = [];
  if (focusTag && career.tags.includes(focusTag)) {
    reasons.push('Phù hợp mối quan tâm hiện tại');
  }
  const matched = career.tags.filter((t) => tags[t]);
  if (matched.length) {
    const labels = matched.map((t) => TAG_LABELS[t] || t).slice(0, 3);
    reasons.push(`Phù hợp thế mạnh: ${labels.join(', ')}`);
  }
  if (career.category) reasons.push(`Nhóm ngành ${career.category}`);
  return reasons.slice(0, 3);
}

function scoreCareers(state) {
  const profile = state.userProfile || {};
  const userType = profile.education_level || 'high_school';
  const tags = state.tags || {};
  const focusTag = state.focusTag;
  const answersText = normalizeText(state.answers.join(' '));

  const scored = CAREERS.map((career) => {
    let score = 30;

    // Core tag matching
    for (const tag of career.tags) {
      const weight = tags[tag] || 0;
      if (weight) score += 12 * weight;
      if (answersText.includes(normalizeText(tag))) score += 4;
    }

    // Focus tag bonus
    if (focusTag && career.tags.includes(focusTag)) {
      score += 25 + (tags[focusTag] || 0) * 3;
    }

    // Profile-based weighting
    if (userType === 'professional') {
      // Professionals might favor management/leadership roles if applicable
      if (career.tags.includes('management') || career.tags.includes('leadership')) {
        score += 15;
      }
      // Penalize entry-level sounding roles if needed, or just boost seniority
    } else if (userType === 'high_school') {
      // Boost academic/subject aligned roles
      if (career.tags.some(t => ['math', 'physics', 'chemistry', 'biology', 'literature'].includes(t))) {
        score += 10;
      }
    }

    const noise = (hashCode(career.name + answersText) % 11);
    score += noise;
    return { career_name: career.name, match_score: score, reasons: buildReasons(career, tags, focusTag) };
  });

  scored.sort((a, b) => b.match_score - a.match_score);
  const top = scored.slice(0, 10);
  const max = top[0]?.match_score || 1;
  return top.map((r, idx) => ({
    ...r,
    match_score: Math.max(25, Math.min(98, Math.round((r.match_score / max) * 100) - idx))
  }));
}

function hashCode(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) - hash) + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}



async function analyzeResponseWithLLM(question, answer, profile) {
  const apiKey = localStorage.getItem('GEMINI_API_KEY');
  if (!apiKey) return null;

  try {
    const prompt = `
      Bạn là một chuyên gia tư vấn nghề nghiệp. 
      Câu hỏi cuối cùng của chatbot: "${question}"
      Câu trả lời của người dùng: "${answer}"
      Thông tin hồ sơ người dùng: ${JSON.stringify(profile)}

      Hãy phân tích câu trả lời trên:
      1. Phân loại thái độ (sentiment): "positive" (tích cực/đồng ý), "negative" (tiêu cực/không đồng ý), "neutral" (trung lập).
      2. Xác định các chủ đề nghề nghiệp hoặc sở thích ẩn ý (implied_topics) dựa trên câu trả lời (tiếng Anh).
      
      TRẢ VỀ DUY NHẤT JSON:
      {
        "sentiment": "positive" | "negative" | "neutral",
        "confidence": 0.0-1.0,
        "implied_topics": ["topic1", "topic2"],
        "reasoning": "giải thích ngắn gọn"
      }
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error("LLM Analysis Error:", e);
  }
  return null;
}

export const offlineApi = {
  getMe(token) {
    if (!token || !token.startsWith('offline:')) return { success: false };
    const userId = Number(token.replace('offline:', ''));
    const user = getUsers().find((u) => u.id === userId);
    if (!user) return { success: false };
    return { success: true, data: { user_id: user.id, email: user.email, user_type: user.user_type } };
  },
  login({ email, password }) {
    const user = getUsers().find((u) => u.email === email && u.password === password);
    if (!user) return { success: false, error: 'Sai email hoặc mật khẩu' };
    const token = `offline:${user.id}`;
    return { success: true, data: { user_id: user.id, email: user.email, user_type: user.user_type, token } };
  },
  register({ email, password, user_type }) {
    const users = getUsers();
    if (users.find((u) => u.email === email)) {
      return { success: false, error: 'Email đã tồn tại' };
    }
    const nextId = Math.max(1, ...users.map((u) => u.id)) + 1;
    const user = { id: nextId, email, password, user_type: user_type || 'high_school' };
    users.push(user);
    saveUsers(users);
    const token = `offline:${user.id}`;
    return { success: true, data: { user_id: user.id, email: user.email, user_type: user.user_type, token } };
  },
  getProfile(userId) {
    const profiles = getProfiles();
    return { success: true, data: profiles[userId] || null };
  },
  updateProfile(userId, payload) {
    const profiles = getProfiles();
    profiles[userId] = { ...profiles[userId], ...payload };
    saveProfiles(profiles);
    return { success: true, data: { updated: true } };
  },
  async sendMessage({ conversation_id, message, user_id, request_more, profile }) {
    const convId = conversation_id || `conv_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    ensureConversation(convId, user_id || null, message);
    const messages = getMessages(convId);
    messages.push({ id: messages.length + 1, sender: 'user', message, created_at: new Date().toISOString() });
    saveMessages(convId, messages);

    const state = getState(convId);
    if (profile) state.userProfile = profile;

    if (message) {
      state.answers.push(message);

      // Smart Analysis
      const lastQ = state.lastQuestionText || "";
      const llmResult = await analyzeResponseWithLLM(lastQ, message, state.userProfile);

      if (llmResult) {
        console.log("LLM Smart Result:", llmResult);
        if (llmResult.sentiment === 'positive') {
          if (state.lastQuestionTags?.length) {
            for (const tag of state.lastQuestionTags) addTagScore(state.tags, tag, 3 * (llmResult.confidence || 1));
          }
          if (llmResult.implied_topics) {
            for (const topic of llmResult.implied_topics) {
              const matchedTag = Object.keys(TAG_KEYWORDS).find(t =>
                normalizeText(topic).includes(t) || t.includes(normalizeText(topic))
              );
              if (matchedTag) addTagScore(state.tags, matchedTag, 2);
            }
          }
        } else if (llmResult.sentiment === 'negative') {
          if (state.lastQuestionTags?.length) {
            for (const tag of state.lastQuestionTags) addTagScore(state.tags, tag, -2);
          }
        }
      } else {
        // Fallback to legacy regex
        const tone = detectAnswerTone(message);
        if (tone > 0 && state.lastQuestionTags?.length) {
          for (const tag of state.lastQuestionTags) addTagScore(state.tags, tag, 2);
        }
        const derived = deriveTags(message);
        Object.keys(derived).forEach((tag) => addTagScore(state.tags, tag, derived[tag]));
      }

      // Update focus tags if detected
      const subjectTag = detectSubjectTag(message);
      const groupTag = detectGroupTag(message);
      if (subjectTag) {
        state.focusTag = subjectTag;
        state.focusType = 'subject';
        state.focusCount = 0;
        state.focusIndex = 0;
      } else if (groupTag) {
        state.focusTag = groupTag;
        state.focusType = 'group';
        state.focusCount = 0;
        state.focusIndex = 0;
      }
    }

    const enoughInfo = state.answers.length >= 6;
    if (enoughInfo && !request_more) {
      const recs = scoreCareers(state);
      saveRecommendations(convId, recs);
      saveState(convId, state);
      return {
        success: true,
        data: {
          bot_reply: 'Đây là gợi ý nghề nghiệp phù hợp:',
          recommendations: recs,
          next_node: null,
          completed: true,
          conversation_id: convId
        }
      };
    }

    const question = pickNextQuestion(state);
    saveState(convId, state);
    const response = question.text;
    messages.push({ id: messages.length + 1, sender: 'bot', message: response, created_at: new Date().toISOString() });
    saveMessages(convId, messages);
    return {
      success: true,
      data: { bot_reply: response, options: [], next_node: question.id, completed: false, conversation_id: convId }
    };
  },
  getHistory(userId) {
    const convs = getConversations().filter((c) => !userId || c.user_id === userId);
    const data = convs.map((c) => {
      const messages = getMessages(c.conversation_id);
      return {
        conversation_id: c.conversation_id,
        title: c.title,
        created_at: c.created_at,
        updated_at: c.updated_at,
        message_count: messages.length
      };
    }).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    return { success: true, data };
  },
  getMessages(conversationId) {
    return { success: true, data: getMessages(conversationId) };
  },
  getRecommendations(conversationId) {
    return { success: true, data: getRecommendations(conversationId) };
  },
  renameConversation(conversationId, title) {
    const convs = getConversations();
    const idx = convs.findIndex((c) => c.conversation_id === conversationId);
    if (idx !== -1) {
      convs[idx].title = title;
      saveConversations(convs);
    }
    return { success: true };
  },
  deleteConversation(conversationId) {
    const convs = getConversations().filter((c) => c.conversation_id !== conversationId);
    saveConversations(convs);
    localStorage.removeItem(`messages:${conversationId}`);
    localStorage.removeItem(`recommendations:${conversationId}`);
    localStorage.removeItem(`state:${conversationId}`);
    return { success: true };
  },
  deleteHistory(userId) {
    const convs = getConversations().filter((c) => c.user_id !== userId);
    saveConversations(convs);
    return { success: true };
  },
  exploreFilters() {
    return {
      success: true,
      data: {
        categories: Array.from(new Set(BASE_CAREERS.map((c) => c.category))),
        tags: Array.from(new Set(BASE_CAREERS.flatMap((c) => c.tags)))
      }
    };
  },
  exploreJobs({ q, category, tag, limit = 120, offset = 0 }) {
    // Map category to icon
    const getMappingIcon = (cat) => {
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
    };

    const query = normalizeText(String(q || ''));
    const imgPrefix = 'career-icons/';

    let list = BASE_CAREERS.map((c, idx) => ({
      id: idx + 1,
      career_name: c.name,
      title: c.name,
      category: c.category,
      tags: c.tags,
      description: `Mô tả cho ${c.name}...`,
      salary: '10M - 50M VNĐ',
      image_url: `${imgPrefix}${getMappingIcon(c.category)}`
    }));

    if (query) {
      list = list.filter((j) => {
        const title = normalizeText(j.title);
        return title.includes(query) || isSubsequence(query, title);
      });
    }
    if (category) {
      list = list.filter((j) => j.category === category);
    }
    if (tag) {
      list = list.filter((j) => j.tags.includes(tag));
    }

    const total = list.length;
    const slice = list.slice(offset, offset + limit);
    return { success: true, data: slice, total };
  }
};

function isSubsequence(query, text) {
  if (!query) return true;
  let i = 0;
  for (let j = 0; j < text.length && i < query.length; j += 1) {
    if (text[j] === query[i]) i += 1;
  }
  return i === query.length;
}
