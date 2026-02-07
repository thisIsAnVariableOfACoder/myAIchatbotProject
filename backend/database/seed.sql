-- FILE: backend/database/seed.sql

-- Sample users
INSERT INTO users (email, password_hash, user_type) VALUES
('student1@test.com', '$2b$10$hashedpassword1', 'high_school'),
('student2@test.com', '$2b$10$hashedpassword2', 'university'),
('worker1@test.com', '$2b$10$hashedpassword3', 'professional'),
('admin@test.com', '$2b$10$hashedpassword4', 'admin'),
('student3@test.com', '$2b$10$hashedpassword5', 'high_school'),
('student4@test.com', '$2b$10$hashedpassword6', 'university'),
('student5@test.com', '$2b$10$hashedpassword7', 'high_school'),
('worker2@test.com', '$2b$10$hashedpassword8', 'professional'),
('worker3@test.com', '$2b$10$hashedpassword9', 'professional'),
('student6@test.com', '$2b$10$hashedpassword10', 'university'),
('student7@test.com', '$2b$10$hashedpassword11', 'high_school'),
('worker4@test.com', '$2b$10$hashedpassword12', 'professional'),
('worker5@test.com', '$2b$10$hashedpassword13', 'professional'),
('student8@test.com', '$2b$10$hashedpassword14', 'university'),
('student9@test.com', '$2b$10$hashedpassword15', 'high_school');

-- Sample profiles
INSERT INTO profiles (user_id, skills, interests, education_level, current_grade, work_experience_years, preferred_work_style) VALUES
(1, '["coding","math","problem_solving"]', '["technology","gaming"]', 'high_school', 11, NULL, 'hybrid'),
(2, '["writing","research","public_speaking"]', '["business","marketing"]', 'university', NULL, NULL, 'hybrid'),
(3, '["excel","project_management"]', '["data","analytics"]', 'bachelor', NULL, 4, 'office'),
(4, '["teaching","communication"]', '["education"]', 'bachelor', NULL, 6, 'office'),
(5, '["design","photography"]', '["arts","fashion"]', 'high_school', 10, NULL, 'remote'),
(6, '["statistics","sql","python"]', '["data","technology"]', 'university', NULL, NULL, 'hybrid'),
(7, '["biology","chemistry"]', '["healthcare","research"]', 'high_school', 12, NULL, 'office'),
(8, '["sales","communication"]', '["business","people"]', 'professional', NULL, 5, 'office'),
(9, '["design","user_research"]', '["arts","technology"]', 'professional', NULL, 3, 'remote'),
(10, '["coding","javascript","ui"]', '["technology","design"]', 'university', NULL, NULL, 'hybrid'),
(11, '["math","physics"]', '["engineering","technology"]', 'high_school', 12, NULL, 'office'),
(12, '["accounting","excel"]', '["finance","business"]', 'professional', NULL, 7, 'office'),
(13, '["hr","communication"]', '["people","business"]', 'professional', NULL, 6, 'hybrid'),
(14, '["content","social"]', '["marketing","media"]', 'university', NULL, NULL, 'remote'),
(15, '["english","communication"]', '["education","languages"]', 'high_school', 11, NULL, 'office');
-- Sample careers
INSERT INTO careers (name, category, required_skills, salary_range, job_outlook, description) VALUES
('Software Engineer', 'Technology', '["coding","algorithms","teamwork"]', '800-3000 USD', 'excellent', 'Software development, applications'),
('Data Analyst', 'Technology', '["statistics","excel","sql"]', '600-2000 USD', 'very_good', 'Data analysis and reporting'),
('UI/UX Designer', 'Design', '["design","user_research","prototyping"]', '500-1800 USD', 'good', 'User interface and experience design'),
('Marketing Specialist', 'Business', '["communication","creativity","analytics"]', '400-1500 USD', 'good', 'Marketing strategy and campaigns'),
('Teacher', 'Education', '["teaching","patience","subject_knowledge"]', '300-1000 USD', 'stable', 'Teaching and education'),
('Business Analyst', 'Business', '["analysis","communication","excel"]', '700-2200 USD', 'good', 'Requirements analysis and process improvement'),
('Product Manager', 'Business', '["strategy","communication","research"]', '900-3000 USD', 'good', 'Product discovery and delivery'),
('UX Researcher', 'Design', '["research","empathy","analysis"]', '700-2000 USD', 'good', 'User research and insights'),
('Data Engineer', 'Technology', '["sql","python","pipelines"]', '900-3200 USD', 'very_good', 'Data pipelines and infrastructure'),
('Data Scientist', 'Technology', '["statistics","python","ml"]', '900-3500 USD', 'very_good', 'Machine learning and modeling'),
('QA Engineer', 'Technology', '["testing","automation","detail"]', '600-1800 USD', 'good', 'Software testing and quality'),
('DevOps Engineer', 'Technology', '["linux","ci_cd","cloud"]', '900-3200 USD', 'very_good', 'DevOps and reliability'),
('Cloud Engineer', 'Technology', '["cloud","network","automation"]', '900-3200 USD', 'very_good', 'Cloud architecture and ops'),
('Cybersecurity Analyst', 'Technology', '["security","network","analysis"]', '800-3000 USD', 'very_good', 'Security monitoring and response'),
('Mobile Developer', 'Technology', '["mobile","coding","ui"]', '700-2500 USD', 'good', 'Android and iOS apps'),
('Frontend Developer', 'Technology', '["html","css","javascript"]', '700-2400 USD', 'good', 'Web UI development'),
('Backend Developer', 'Technology', '["api","database","coding"]', '700-2600 USD', 'good', 'Server-side development'),
('Full Stack Developer', 'Technology', '["frontend","backend","database"]', '800-2800 USD', 'good', 'End-to-end web development'),
('AI Engineer', 'Technology', '["python","ml","deployment"]', '1000-4000 USD', 'excellent', 'AI systems and deployment'),
('Network Engineer', 'Technology', '["network","routing","security"]', '700-2200 USD', 'good', 'Network infrastructure');
INSERT INTO careers (name, category, required_skills, salary_range, job_outlook, description) VALUES
('Game Developer', 'Technology', '["coding","game_design","math"]', '600-2000 USD', 'good', 'Game development'),
('Graphic Designer', 'Design', '["design","typography","tools"]', '400-1500 USD', 'good', 'Visual design and branding'),
('Digital Product Designer', 'Design', '["design","prototyping","ux"]', '700-2200 USD', 'good', 'Product design'),
('Content Creator', 'Media', '["content","storytelling","editing"]', '300-1500 USD', 'good', 'Content production'),
('SEO Specialist', 'Marketing', '["seo","analytics","content"]', '400-1600 USD', 'good', 'Search optimization'),
('Social Media Manager', 'Marketing', '["social","communication","creativity"]', '400-1600 USD', 'good', 'Social channel management'),
('Copywriter', 'Marketing', '["writing","creativity","research"]', '400-1400 USD', 'good', 'Marketing copy'),
('Video Editor', 'Media', '["editing","storytelling","tools"]', '400-1600 USD', 'good', 'Video post production'),
('Financial Analyst', 'Finance', '["analysis","excel","finance"]', '700-2400 USD', 'good', 'Financial analysis'),
('Accountant', 'Finance', '["accounting","detail","tax"]', '600-2000 USD', 'stable', 'Accounting and reporting'),
('HR Specialist', 'Business', '["communication","hr","process"]', '500-1700 USD', 'good', 'Human resources'),
('Sales Representative', 'Business', '["communication","negotiation","crm"]', '500-2000 USD', 'good', 'Sales and client management'),
('Customer Support', 'Business', '["communication","empathy","problem_solving"]', '350-1200 USD', 'stable', 'Customer support'),
('Operations Manager', 'Business', '["process","leadership","analysis"]', '800-2600 USD', 'good', 'Operations management'),
('Supply Chain Analyst', 'Business', '["analysis","logistics","excel"]', '700-2200 USD', 'good', 'Supply chain analysis'),
('Project Manager', 'Business', '["planning","communication","delivery"]', '800-2600 USD', 'good', 'Project delivery'),
('Civil Engineer', 'Engineering', '["math","design","construction"]', '800-2500 USD', 'good', 'Civil engineering'),
('Mechanical Engineer', 'Engineering', '["math","physics","design"]', '800-2600 USD', 'good', 'Mechanical engineering'),
('Architect', 'Engineering', '["design","planning","visualization"]', '800-2600 USD', 'good', 'Architecture and planning'),
('English Teacher', 'Education', '["english","teaching","communication"]', '400-1400 USD', 'stable', 'English teaching'),
('Nurse', 'Healthcare', '["care","communication","medical"]', '500-1800 USD', 'stable', 'Patient care'),
('Pharmacist', 'Healthcare', '["chemistry","detail","care"]', '700-2200 USD', 'good', 'Pharmacy and medication'),
('Lab Technician', 'Healthcare', '["lab","detail","analysis"]', '500-1600 USD', 'stable', 'Lab testing'),
('Research Assistant', 'Education', '["research","analysis","writing"]', '400-1600 USD', 'good', 'Academic research support'),
('Business Development', 'Business', '["sales","strategy","networking"]', '700-2400 USD', 'good', 'Partnerships and growth'),
('Data Visualization Specialist', 'Technology', '["data","visualization","tools"]', '700-2200 USD', 'good', 'Data storytelling');

-- Sample chat messages
INSERT INTO chat_messages (conversation_id, user_id, sender, message, node_id) VALUES
('conv_001', 1, 'bot', 'Chào bạn! Bạn đang học lớp mấy?', 'node_1'),
('conv_001', 1, 'user', 'Lớp 11', 'node_1'),
('conv_001', 1, 'bot', 'Bạn thích môn học nào nhất?', 'node_2'),
('conv_001', 1, 'user', 'Toán và Tin', 'node_2'),
('conv_001', 1, 'bot', 'Bạn có thích làm việc với máy tính không?', 'node_3'),
('conv_002', 2, 'bot', 'Bạn quan tâm lĩnh vực nào?', 'node_1'),
('conv_002', 2, 'user', 'Kinh doanh và marketing', 'node_1'),
('conv_002', 2, 'bot', 'Bạn thích giao tiếp hay phân tích số liệu?', 'node_2'),
('conv_002', 2, 'user', 'Giao tiếp', 'node_2'),
('conv_003', 3, 'bot', 'Bạn muốn chuyển nghề sang lĩnh vực nào?', 'node_1'),
('conv_003', 3, 'user', 'Data', 'node_1'),
('conv_003', 3, 'bot', 'Bạn đã biết SQL chưa?', 'node_2'),
('conv_003', 3, 'user', 'Chưa', 'node_2'),
('conv_004', 5, 'bot', 'Bạn thích sáng tạo hay logic?', 'node_1'),
('conv_004', 5, 'user', 'Sáng tạo', 'node_1'),
('conv_005', 6, 'bot', 'Bạn thích phân tích dữ liệu không?', 'node_3'),
('conv_005', 6, 'user', 'Có', 'node_3'),
('conv_006', 8, 'bot', 'Bạn ưu tiên thu nhập hay sở thích?', 'node_1'),
('conv_006', 8, 'user', 'Thu nhập', 'node_1'),
('conv_007', 10, 'bot', 'Bạn thích giao tiếp hay làm việc với máy tính?', 'node_2'),
('conv_007', 10, 'user', 'Làm việc với máy tính', 'node_2'),
('conv_008', 11, 'bot', 'Bạn muốn học ngành kỹ thuật gì?', 'node_1'),
('conv_008', 11, 'user', 'Cơ khí và điện', 'node_1'),
('conv_009', 12, 'bot', 'Bạn quan tâm tài chính hay kế toán?', 'node_1'),
('conv_009', 12, 'user', 'Kế toán', 'node_1'),
('conv_010', 14, 'bot', 'Bạn muốn làm marketing hay content?', 'node_1'),
('conv_010', 14, 'user', 'Content', 'node_1');

INSERT INTO scenarios (name, target_user_type, nodes, edges, is_active) VALUES
('High School Career Discovery', 'high_school',
 '[{"id":"node_1","question":"Bạn đang học lớp mấy?","options":["10","11","12"],"type":"choice"},{"id":"node_2","question":"Bạn thích môn học nào nhất?","options":["Toán","Văn","Anh","Tin"],"type":"choice"},{"id":"node_3","question":"Bạn có thích làm việc với máy tính không?","options":["Có","Không","Chưa chắc"],"type":"choice"},{"id":"node_4","question":"Bạn thích giải quyết vấn đề hay sáng tạo?","options":["Giải quyết","Sáng tạo","Cả hai"],"type":"choice"}]',
 '[{"from":"node_1","to":"node_2","condition":"answered"},{"from":"node_2","to":"node_3","condition":"answered"},{"from":"node_3","to":"node_4","condition":"answered"}]',
 1),
('University Career Growth', 'university',
 '[{"id":"node_1","question":"Bạn đang học ngành nào?","options":["IT","Kinh doanh","Thiết kế","Khoa học"],"type":"choice"},{"id":"node_2","question":"Bạn muốn việc làm liên quan chuyên môn hay chuyển hướng?","options":["Liên quan","Chuyển hướng"],"type":"choice"},{"id":"node_3","question":"Bạn thích phân tích dữ liệu không?","options":["Có","Không"],"type":"choice"}]',
 '[{"from":"node_1","to":"node_2","condition":"answered"},{"from":"node_2","to":"node_3","condition":"answered"}]',
 1),
('Professional Career Switch', 'professional',
 '[{"id":"node_1","question":"Bạn muốn chuyển nghề vì lý do gì?","options":["Thu nhập","Sở thích","Cơ hội"],"type":"choice"},{"id":"node_2","question":"Bạn có sẵn sàng học kỹ năng mới 6-12 tháng?","options":["Có","Không","Cân nhắc"],"type":"choice"},{"id":"node_3","question":"Bạn thích việc làm đòi hỏi giao tiếp hay tập trung kỹ thuật?","options":["Giao tiếp","Kỹ thuật","Cân bằng"],"type":"choice"}]',
 '[{"from":"node_1","to":"node_2","condition":"answered"},{"from":"node_2","to":"node_3","condition":"answered"}]',
 1),
('General Career Explorer', NULL,
 '[{"id":"node_1","question":"Bạn thích lĩnh vực nào nhất?","options":["Công nghệ","Kinh doanh","Thiết kế","Y tế"],"type":"choice"},{"id":"node_2","question":"Bạn thích giao tiếp hay phân tích?","options":["Giao tiếp","Phân tích","Cân bằng"],"type":"choice"}]',
 '[{"from":"node_1","to":"node_2","condition":"answered"}]',
 1);

-- Sample scenario nodes
INSERT INTO scenario_nodes (scenario_id, node_id, question, answer_type, options, weight) VALUES
(1, 'node_1', 'Bạn đang học lớp mấy?', 'multiple_choice', '["10","11","12"]', 1.0),
-- Bổ sung nhiều nghề nghiệp mới cho từng nhóm ngành
INSERT INTO careers (name, category, required_skills, salary_range, job_outlook, description) VALUES
('Software Engineer', 'Technology', '["coding","problem_solving","sql"]', 'Thoa thuan', 'good', 'Software Engineer thuoc nhom Technology'),
('Frontend Developer', 'Technology', '["coding","problem_solving","sql"]', 'Thoa thuan', 'good', 'Frontend Developer thuoc nhom Technology'),
('Backend Developer', 'Technology', '["coding","problem_solving","sql"]', 'Thoa thuan', 'good', 'Backend Developer thuoc nhom Technology'),
('Full Stack Developer', 'Technology', '["coding","problem_solving","sql"]', 'Thoa thuan', 'good', 'Full Stack Developer thuoc nhom Technology'),
('Mobile Developer', 'Technology', '["coding","problem_solving","sql"]', 'Thoa thuan', 'good', 'Mobile Developer thuoc nhom Technology'),
('Game Developer', 'Technology', '["coding","problem_solving","sql"]', 'Thoa thuan', 'good', 'Game Developer thuoc nhom Technology'),
('QA Engineer', 'Technology', '["coding","problem_solving","sql"]', 'Thoa thuan', 'good', 'QA Engineer thuoc nhom Technology'),
('DevOps Engineer', 'Technology', '["coding","problem_solving","sql"]', 'Thoa thuan', 'good', 'DevOps Engineer thuoc nhom Technology'),
('Cloud Engineer', 'Technology', '["coding","problem_solving","sql"]', 'Thoa thuan', 'good', 'Cloud Engineer thuoc nhom Technology'),
('Network Engineer', 'Technology', '["coding","problem_solving","sql"]', 'Thoa thuan', 'good', 'Network Engineer thuoc nhom Technology'),
('Cybersecurity Analyst', 'Technology', '["coding","problem_solving","sql"]', 'Thoa thuan', 'good', 'Cybersecurity Analyst thuoc nhom Technology'),
('AI Engineer', 'Technology', '["coding","problem_solving","sql"]', 'Thoa thuan', 'good', 'AI Engineer thuoc nhom Technology'),
('Embedded Engineer', 'Technology', '["coding","problem_solving","sql"]', 'Thoa thuan', 'good', 'Embedded Engineer thuoc nhom Technology'),
('Systems Engineer', 'Technology', '["coding","problem_solving","sql"]', 'Thoa thuan', 'good', 'Systems Engineer thuoc nhom Technology'),
('Site Reliability Engineer', 'Technology', '["coding","problem_solving","sql"]', 'Thoa thuan', 'good', 'Site Reliability Engineer thuoc nhom Technology'),
('IT Support', 'Technology', '["coding","problem_solving","sql"]', 'Thoa thuan', 'good', 'IT Support thuoc nhom Technology'),
('IT Administrator', 'Technology', '["coding","problem_solving","sql"]', 'Thoa thuan', 'good', 'IT Administrator thuoc nhom Technology'),
('Database Administrator', 'Technology', '["coding","problem_solving","sql"]', 'Thoa thuan', 'good', 'Database Administrator thuoc nhom Technology'),
('Security Engineer', 'Technology', '["coding","problem_solving","sql"]', 'Thoa thuan', 'good', 'Security Engineer thuoc nhom Technology'),
('Automation Engineer', 'Technology', '["coding","problem_solving","sql"]', 'Thoa thuan', 'good', 'Automation Engineer thuoc nhom Technology'),
('AI Researcher', 'Technology', '["coding","problem_solving","sql"]', 'Thoa thuan', 'good', 'AI Researcher thuoc nhom Technology'),
('MLOps Engineer', 'Technology', '["coding","problem_solving","sql"]', 'Thoa thuan', 'good', 'MLOps Engineer thuoc nhom Technology'),
('AR/VR Developer', 'Technology', '["coding","problem_solving","sql"]', 'Thoa thuan', 'good', 'AR/VR Developer thuoc nhom Technology'),
('Blockchain Developer', 'Technology', '["coding","problem_solving","sql"]', 'Thoa thuan', 'good', 'Blockchain Developer thuoc nhom Technology'),
('Solutions Architect', 'Technology', '["coding","problem_solving","sql"]', 'Thoa thuan', 'good', 'Solutions Architect thuoc nhom Technology'),
('Platform Engineer', 'Technology', '["coding","problem_solving","sql"]', 'Thoa thuan', 'good', 'Platform Engineer thuoc nhom Technology'),
('DevSecOps Engineer', 'Technology', '["coding","problem_solving","sql"]', 'Thoa thuan', 'good', 'DevSecOps Engineer thuoc nhom Technology'),
('Product Security Engineer', 'Technology', '["coding","problem_solving","sql"]', 'Thoa thuan', 'good', 'Product Security Engineer thuoc nhom Technology'),
('Systems Administrator', 'Technology', '["coding","problem_solving","sql"]', 'Thoa thuan', 'good', 'Systems Administrator thuoc nhom Technology'),
('Technical Support Engineer', 'Technology', '["coding","problem_solving","sql"]', 'Thoa thuan', 'good', 'Technical Support Engineer thuoc nhom Technology');
(1, 'node_3', 'Bạn có thích làm việc với máy tính không?', 'multiple_choice', '["Có","Không","Chưa chắc"]', 1.2),
(1, 'node_4', 'Bạn thích giải quyết vấn đề hay sáng tạo?', 'multiple_choice', '["Giải quyết","Sáng tạo","Cả hai"]', 1.0),
(1, 'node_5', 'Bạn ưu tiên ổn định hay thử thách?', 'multiple_choice', '["Ổn định","Thử thách","Cân bằng"]', 1.1),
(2, 'node_1', 'Bạn đang học ngành nào?', 'multiple_choice', '["IT","Kinh doanh","Thiết kế","Khoa học"]', 1.0),
(2, 'node_2', 'Bạn muốn việc làm liên quan chuyên môn hay chuyển hướng?', 'multiple_choice', '["Liên quan","Chuyển hướng"]', 1.0),
(2, 'node_3', 'Bạn thích phân tích dữ liệu không?', 'multiple_choice', '["Có","Không"]', 1.1),
(3, 'node_1', 'Bạn muốn chuyển nghề vì lý do gì?', 'multiple_choice', '["Thu nhập","Sở thích","Cơ hội"]', 1.0),
(3, 'node_2', 'Bạn có sẵn sàng học kỹ năng mới 6-12 tháng?', 'multiple_choice', '["Có","Không","Cân nhắc"]', 1.0),
(3, 'node_3', 'Bạn thích việc làm đòi hỏi giao tiếp hay tập trung kỹ thuật?', 'multiple_choice', '["Giao tiếp","Kỹ thuật","Cân bằng"]', 1.1),
(4, 'node_1', 'Bạn thích lĩnh vực nào nhất?', 'multiple_choice', '["Công nghệ","Kinh doanh","Thiết kế","Y tế"]', 1.0),
(4, 'node_2', 'Bạn thích giao tiếp hay phân tích?', 'multiple_choice', '["Giao tiếp","Phân tích","Cân bằng"]', 1.0);

-- Sample recommendations
INSERT INTO recommendations (conversation_id, user_id, career_name, match_score, reasons, learning_path) VALUES
('conv_001', 1, 'Software Engineer', 85.5, '["Gioi toan","Thich cong nghe","Giai quyet van de"]', 'Python 3 months -> JavaScript 3 months -> Framework 6 months'),
('conv_002', 2, 'Marketing Specialist', 72.0, '["Giao tiep","Sang tao","Quan tam kinh doanh"]', 'Content 2 months -> Ads 3 months -> Analytics 3 months'),
('conv_003', 3, 'Data Analyst', 78.0, '["Phan tich so lieu","Kien thuc Excel","Ham hoc SQL"]', 'Excel 2 months -> SQL 3 months -> BI 3 months'),
('conv_004', 5, 'UI/UX Designer', 74.0, '["Sang tao","Thich thiet ke","Quan tam nguoi dung"]', 'Design basics 2 months -> Figma 2 months -> Portfolio 4 months'),
('conv_005', 6, 'Data Engineer', 80.0, '["Python","SQL","He thong"]', 'Python 2 months -> SQL 2 months -> Pipelines 4 months'),
('conv_006', 8, 'Sales Representative', 70.0, '["Giao tiep","Thich thuong luong"]', 'Sales basics 2 months -> CRM 2 months -> Negotiation 2 months'),
('conv_007', 10, 'Frontend Developer', 76.0, '["Yeu thich UI","JS co ban"]', 'HTML CSS 2 months -> JS 3 months -> React 3 months'),
('conv_008', 11, 'Mechanical Engineer', 68.0, '["Yeu thich ky thuat","Vat ly"]', 'Math 3 months -> CAD 2 months -> Projects 4 months'),
('conv_009', 12, 'Accountant', 73.0, '["Ke toan","Chi tiet"]', 'Accounting 3 months -> Tax 2 months -> Reporting 2 months'),
('conv_010', 14, 'Content Creator', 71.0, '["Sang tao","Thich truyen thong"]', 'Writing 2 months -> Video 2 months -> Social 2 months');

-- Sample analytics events
INSERT INTO analytics (event_type, user_id, metadata) VALUES
('user_registered', 6, '{"source":"web"}'),
('conversation_started', 2, '{"scenario":"University Career Growth"}'),
('conversation_completed', 1, '{"duration_sec":380}'),
('career_viewed', 3, '{"career":"Data Analyst"}'),
('career_viewed', 5, '{"career":"UI/UX Designer"}'),
('conversation_started', 8, '{"scenario":"Professional Career Switch"}'),
('conversation_completed', 6, '{"duration_sec":420}'),
('career_viewed', 10, '{"career":"Frontend Developer"}'),
('career_viewed', 12, '{"career":"Accountant"}'),
('conversation_completed', 14, '{"duration_sec":310}');

-- Sample learning paths (use career name to map IDs)
INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 1, 'Programming Basics', 'Variables, loops, functions', 2, '["freecodecamp","mdn"]' FROM careers WHERE name = 'Software Engineer';
INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 2, 'Build Web Apps', 'Frontend and backend basics', 4, '["frontendmentor","nodejs"]' FROM careers WHERE name = 'Software Engineer';

INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 1, 'Excel and Reporting', 'Pivot tables, charts', 2, '["exceljet"]' FROM careers WHERE name = 'Data Analyst';
INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 2, 'SQL Fundamentals', 'Queries and joins', 2, '["sqlbolt"]' FROM careers WHERE name = 'Data Analyst';

INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 1, 'Design Foundations', 'Color, layout, typography', 2, '["figma","coursera"]' FROM careers WHERE name = 'UI/UX Designer';
INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 2, 'Portfolio Projects', 'Case studies and prototypes', 3, '["behance"]' FROM careers WHERE name = 'UI/UX Designer';

INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 1, 'Marketing Basics', 'Channels and positioning', 2, '["hubspot"]' FROM careers WHERE name = 'Marketing Specialist';
INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 2, 'Ads and Analytics', 'Paid ads, tracking', 3, '["google"]' FROM careers WHERE name = 'Marketing Specialist';

INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 1, 'Teaching Skills', 'Lesson planning', 2, '["teach.com"]' FROM careers WHERE name = 'Teacher';
INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 2, 'Classroom Practice', 'Teaching practice', 3, '["teacherresources"]' FROM careers WHERE name = 'Teacher';

INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 1, 'Business Analysis Basics', 'Requirements and process', 2, '["ba-guide"]' FROM careers WHERE name = 'Business Analyst';
INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 2, 'Stakeholder Skills', 'Communication and facilitation', 2, '["mindtools"]' FROM careers WHERE name = 'Business Analyst';

INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 1, 'Product Foundations', 'Discovery and roadmap', 2, '["productschool"]' FROM careers WHERE name = 'Product Manager';
INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 2, 'Metrics and Delivery', 'A/B tests, KPIs', 3, '["amplitude"]' FROM careers WHERE name = 'Product Manager';

INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 1, 'Research Methods', 'Interviews and surveys', 2, '["nngroup"]' FROM careers WHERE name = 'UX Researcher';
INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 2, 'Synthesis', 'Affinity mapping', 2, '["miro"]' FROM careers WHERE name = 'UX Researcher';

INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 1, 'Data Pipelines', 'ETL and modeling', 3, '["databricks"]' FROM careers WHERE name = 'Data Engineer';
INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 2, 'Cloud Warehousing', 'BigQuery, Snowflake', 3, '["snowflake"]' FROM careers WHERE name = 'Data Engineer';

INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 1, 'Stats and ML', 'Regression and classification', 3, '["kaggle"]' FROM careers WHERE name = 'Data Scientist';
INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 2, 'Model Deployment', 'APIs and monitoring', 3, '["mlops"]' FROM careers WHERE name = 'Data Scientist';
INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 1, 'Testing Fundamentals', 'Test plans and cases', 2, '["istqb"]' FROM careers WHERE name = 'QA Engineer';
INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 2, 'Automation', 'Selenium and CI', 3, '["selenium"]' FROM careers WHERE name = 'QA Engineer';

INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 1, 'Linux and Cloud', 'Servers and networking', 2, '["linuxjourney"]' FROM careers WHERE name = 'DevOps Engineer';
INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 2, 'CI/CD', 'Pipelines and deployment', 3, '["github-actions"]' FROM careers WHERE name = 'DevOps Engineer';

INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 1, 'Cloud Basics', 'Compute, storage, IAM', 2, '["aws-training"]' FROM careers WHERE name = 'Cloud Engineer';
INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 2, 'Automation', 'Infrastructure as code', 2, '["terraform"]' FROM careers WHERE name = 'Cloud Engineer';

INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 1, 'Security Basics', 'Threats and controls', 2, '["cybrary"]' FROM careers WHERE name = 'Cybersecurity Analyst';
INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 2, 'SOC Skills', 'Monitoring and response', 3, '["splunk"]' FROM careers WHERE name = 'Cybersecurity Analyst';

INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 1, 'Mobile Basics', 'Android or iOS', 2, '["developer.android.com"]' FROM careers WHERE name = 'Mobile Developer';
INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 2, 'Build Apps', 'UI and APIs', 3, '["flutter.dev"]' FROM careers WHERE name = 'Mobile Developer';

INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 1, 'Frontend Basics', 'HTML, CSS, JS', 2, '["mdn"]' FROM careers WHERE name = 'Frontend Developer';
INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 2, 'Frameworks', 'React or Vue', 3, '["react.dev"]' FROM careers WHERE name = 'Frontend Developer';

INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 1, 'APIs and Databases', 'REST and SQL', 2, '["nodejs"]' FROM careers WHERE name = 'Backend Developer';
INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 2, 'System Design', 'Scalability basics', 3, '["systemdesign"]' FROM careers WHERE name = 'Backend Developer';

INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 1, 'Full Stack Basics', 'Frontend + backend', 3, '["fullstackopen"]' FROM careers WHERE name = 'Full Stack Developer';
INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 2, 'Deploy Projects', 'Hosting and CI', 2, '["vercel"]' FROM careers WHERE name = 'Full Stack Developer';

INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 1, 'ML Foundations', 'Supervised learning', 3, '["fastai"]' FROM careers WHERE name = 'AI Engineer';
INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 2, 'MLOps', 'Serving models', 3, '["mlflow"]' FROM careers WHERE name = 'AI Engineer';

INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 1, 'Networking Basics', 'TCP/IP, routing', 2, '["cisco"]' FROM careers WHERE name = 'Network Engineer';
INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 2, 'Network Security', 'Firewall, monitoring', 2, '["fortinet"]' FROM careers WHERE name = 'Network Engineer';
INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 1, 'Game Basics', 'Engines and scripting', 2, '["unity"]' FROM careers WHERE name = 'Game Developer';
INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 2, 'Game Projects', 'Prototype and build', 3, '["gamedev"]' FROM careers WHERE name = 'Game Developer';

INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 1, 'Design Tools', 'Photoshop or Figma', 2, '["adobe"]' FROM careers WHERE name = 'Graphic Designer';
INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 2, 'Branding Projects', 'Logos and identity', 2, '["behance"]' FROM careers WHERE name = 'Graphic Designer';

INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 1, 'Content Writing', 'Storytelling basics', 2, '["medium"]' FROM careers WHERE name = 'Content Creator';
INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 2, 'Video Basics', 'Editing and publishing', 2, '["youtube"]' FROM careers WHERE name = 'Content Creator';

INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 1, 'SEO Fundamentals', 'On-page and keyword', 2, '["ahrefs"]' FROM careers WHERE name = 'SEO Specialist';
INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 2, 'SEO Projects', 'Audits and reporting', 2, '["moz"]' FROM careers WHERE name = 'SEO Specialist';

INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 1, 'Social Basics', 'Content planning', 2, '["buffer"]' FROM careers WHERE name = 'Social Media Manager';
INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 2, 'Community Growth', 'Engagement and ads', 2, '["meta"]' FROM careers WHERE name = 'Social Media Manager';

INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 1, 'Finance Basics', 'Statements and ratios', 2, '["investopedia"]' FROM careers WHERE name = 'Financial Analyst';
INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 2, 'Modeling', 'Forecasting and valuation', 3, '["cfi"]' FROM careers WHERE name = 'Financial Analyst';

INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 1, 'Accounting Basics', 'Journal entries', 2, '["accountingcoach"]' FROM careers WHERE name = 'Accountant';
INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 2, 'Tax and Audit', 'Compliance basics', 2, '["aicpa"]' FROM careers WHERE name = 'Accountant';

INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 1, 'Sales Foundations', 'Prospecting', 2, '["salesforce"]' FROM careers WHERE name = 'Sales Representative';
INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 2, 'Negotiation', 'Closing deals', 2, '["hubspot"]' FROM careers WHERE name = 'Sales Representative';

INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 1, 'Project Basics', 'Planning and scope', 2, '["pmi"]' FROM careers WHERE name = 'Project Manager';
INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 2, 'Delivery', 'Risk and reporting', 2, '["jira"]' FROM careers WHERE name = 'Project Manager';

INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 1, 'Construction Basics', 'Materials and safety', 2, '["civil"]' FROM careers WHERE name = 'Civil Engineer';
INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 2, 'Design Tools', 'AutoCAD and plans', 3, '["autocad"]' FROM careers WHERE name = 'Civil Engineer';

INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 1, 'Mechanical Basics', 'Mechanics and CAD', 2, '["solidworks"]' FROM careers WHERE name = 'Mechanical Engineer';
INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 2, 'Prototyping', 'Build and test', 3, '["engineering"]' FROM careers WHERE name = 'Mechanical Engineer';

INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 1, 'Architecture Basics', 'Design thinking', 2, '["architecture"]' FROM careers WHERE name = 'Architect';
INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 2, 'Visualization', '3D tools', 3, '["sketchup"]' FROM careers WHERE name = 'Architect';

INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 1, 'Teaching English', 'Methods and planning', 2, '["tesol"]' FROM careers WHERE name = 'English Teacher';
INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 2, 'Practice', 'Lesson delivery', 2, '["eltresources"]' FROM careers WHERE name = 'English Teacher';

INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 1, 'Nursing Basics', 'Care and hygiene', 2, '["nursing"]' FROM careers WHERE name = 'Nurse';
INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 2, 'Clinical Practice', 'Hospital practice', 4, '["healthcare"]' FROM careers WHERE name = 'Nurse';

INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 1, 'Pharmacy Basics', 'Drug classes', 2, '["pharmacy"]' FROM careers WHERE name = 'Pharmacist';
INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 2, 'Clinical Knowledge', 'Dispensing and counseling', 3, '["clinical"]' FROM careers WHERE name = 'Pharmacist';

INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 1, 'Research Basics', 'Literature review', 2, '["researchgate"]' FROM careers WHERE name = 'Research Assistant';
INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 2, 'Data Skills', 'Analysis and reporting', 2, '["spss"]' FROM careers WHERE name = 'Research Assistant';

INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 1, 'Visualization Tools', 'Tableau or PowerBI', 2, '["tableau"]' FROM careers WHERE name = 'Data Visualization Specialist';
INSERT INTO learning_paths (career_id, step_order, title, description, duration_months, resources)
SELECT id, 2, 'Storytelling', 'Present insights', 2, '["storytelling"]' FROM careers WHERE name = 'Data Visualization Specialist';
