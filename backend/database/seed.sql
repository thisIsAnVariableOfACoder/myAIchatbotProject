-- FILE: backend/database/seed.sql

-- Sample users (with username for login)
INSERT INTO users (email, username, password_hash, user_type) VALUES
('student1@test.com', 'student1', '$2b$10$hashedpassword1', 'high_school'),
('student2@test.com', 'student2', '$2b$10$hashedpassword2', 'university'),
('worker1@test.com', 'worker1', '$2b$10$hashedpassword3', 'professional'),
('admin@test.com', 'admin', '$2b$10$hashedpassword4', 'admin'),
('student3@test.com', 'student3', '$2b$10$hashedpassword5', 'high_school'),
('student4@test.com', 'student4', '$2b$10$hashedpassword6', 'university'),
('student5@test.com', 'student5', '$2b$10$hashedpassword7', 'high_school'),
('worker2@test.com', 'worker2', '$2b$10$hashedpassword8', 'professional'),
('worker3@test.com', 'worker3', '$2b$10$hashedpassword9', 'professional'),
('student6@test.com', 'student6', '$2b$10$hashedpassword10', 'university'),
('student7@test.com', 'student7', '$2b$10$hashedpassword11', 'high_school'),
('worker4@test.com', 'worker4', '$2b$10$hashedpassword12', 'professional'),
('worker5@test.com', 'worker5', '$2b$10$hashedpassword13', 'professional'),
('student8@test.com', 'student8', '$2b$10$hashedpassword14', 'university'),
('student9@test.com', 'student9', '$2b$10$hashedpassword15', 'high_school');

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
('QA Engineer', 'Technology', '["testing","automation","detail"]', '600-1800 USD', 'good', 'Software testing and quality');
