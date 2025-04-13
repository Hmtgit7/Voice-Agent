-- Insert dummy users
INSERT INTO users (id, name, email, password, created_at, updated_at)
VALUES 
('11111111-1111-1111-1111-111111111111', 'Admin User', 'admin@example.com', '$2a$10$uCR31EsF2NvNEwfH.SGQYevcnxvnpkgLWXOLZKK3lh4AVqFCUCJPy', NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', 'HR Manager', 'hr@example.com', '$2a$10$uCR31EsF2NvNEwfH.SGQYevcnxvnpkgLWXOLZKK3lh4AVqFCUCJPy', NOW(), NOW());
-- Note: passwords are hashed "password123"

-- Insert dummy jobs
INSERT INTO jobs (id, title, description, requirements, available_slots, created_at, updated_at)
VALUES 
('33333333-3333-3333-3333-333333333333', 'Senior React Developer', 'We are looking for a Senior React Developer to join our team to build cutting-edge web applications.', 'Minimum 5 years of experience with React, strong knowledge of JavaScript, experience with state management like Redux or Context API.', '["2025-05-01T09:00:00Z", "2025-05-01T14:00:00Z", "2025-05-02T10:00:00Z", "2025-05-02T15:00:00Z", "2025-05-03T11:00:00Z"]'::jsonb, NOW(), NOW()),
('44444444-4444-4444-4444-444444444444', 'UI/UX Designer', 'Join our design team to create beautiful and intuitive user interfaces for our products.', 'Minimum 3 years of experience in UI/UX design, proficiency in Figma or Adobe XD, portfolio of previous work required.', '["2025-05-01T11:00:00Z", "2025-05-01T16:00:00Z", "2025-05-02T09:00:00Z", "2025-05-02T13:00:00Z", "2025-05-03T10:00:00Z"]'::jsonb, NOW(), NOW()),
('55555555-5555-5555-5555-555555555555', 'Backend Node.js Developer', 'We need an experienced Node.js developer to enhance our backend services and APIs.', 'Minimum 4 years of experience with Node.js and Express, knowledge of RESTful API design, experience with databases.', '["2025-05-01T10:00:00Z", "2025-05-01T15:00:00Z", "2025-05-02T11:00:00Z", "2025-05-02T16:00:00Z", "2025-05-03T09:00:00Z"]'::jsonb, NOW(), NOW()),
('66666666-6666-6666-6666-666666666666', 'DevOps Engineer', 'Looking for a DevOps engineer to help us automate our deployment processes and improve infrastructure.', 'Experience with CI/CD pipelines, Docker, Kubernetes, and cloud platforms like AWS or Azure.', '["2025-05-01T13:00:00Z", "2025-05-02T14:00:00Z", "2025-05-03T13:00:00Z"]'::jsonb, NOW(), NOW()),
('77777777-7777-7777-7777-777777777777', 'Product Manager', 'Join our team as a Product Manager to help define and execute our product strategy.', 'Minimum 3 years of experience in product management, excellent communication skills, ability to work with technical and non-technical stakeholders.', '["2025-05-02T12:00:00Z", "2025-05-03T14:00:00Z"]'::jsonb, NOW(), NOW());

-- Insert dummy candidates
INSERT INTO candidates (id, name, phone, email, current_ctc, expected_ctc, notice_period, experience, status, created_at, updated_at)
VALUES 
('88888888-8888-8888-8888-888888888888', 'John Doe', '+1-555-123-4567', 'john.doe@example.com', 85000, 110000, 30, 5.5, 'new', NOW(), NOW()),
('99999999-9999-9999-9999-999999999999', 'Sarah Smith', '+1-555-987-6543', 'sarah.smith@example.com', 65000, 90000, 60, 3.5, 'contacted', NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Michael Johnson', '+1-555-456-7890', 'michael.johnson@example.com', 95000, 120000, 45, 7, 'scheduled', NOW(), NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Emily Brown', '+1-555-789-0123', 'emily.brown@example.com', 70000, 95000, 30, 4, 'interviewed', NOW(), NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Robert Wilson', '+1-555-321-6540', 'robert.wilson@example.com', 90000, 115000, 90, 6, 'hired', NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Jessica Lee', '+1-555-654-3210', 'jessica.lee@example.com', 75000, 100000, 15, 4.5, 'rejected', NOW(), NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'David Taylor', '+1-555-234-5678', 'david.taylor@example.com', 88000, 112000, 60, 5, 'new', NOW(), NOW()),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Amanda Clark', '+1-555-876-5432', 'amanda.clark@example.com', 72000, 95000, 30, 3, 'contacted', NOW(), NOW());

-- Insert dummy appointments
INSERT INTO appointments (id, job_id, candidate_id, date_time, status, created_at, updated_at)
VALUES 
('11112222-3333-4444-5555-666677778888', '33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2025-05-01T09:00:00Z', 'scheduled', NOW(), NOW()),
('22223333-4444-5555-6666-777788889999', '44444444-4444-4444-4444-444444444444', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '2025-05-01T11:00:00Z', 'completed', NOW(), NOW()),
('33334444-5555-6666-7777-888899990000', '55555555-5555-5555-5555-555555555555', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '2025-05-01T10:00:00Z', 'completed', NOW(), NOW()),
('44445555-6666-7777-8888-999900001111', '66666666-6666-6666-6666-666666666666', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '2025-05-01T13:00:00Z', 'cancelled', NOW(), NOW());

-- Insert dummy conversations
INSERT INTO conversations (id, candidate_id, transcript, entities_extracted, created_at)
VALUES 
('55556666-7777-8888-9999-000011112222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'System: Hello Michael, this is Company regarding a Senior React Developer opportunity.
Candidate: Hi, yes I''m interested in learning more.
System: What is your current notice period?
Candidate: I have a 45-day notice period.
System: Can you share your current and expected CTC?
Candidate: I''m currently making 95,000 and I''m looking for around 120,000.
System: When are you available for an interview next week?
Candidate: I can do next Tuesday at 9 AM.
System: We''ve scheduled your interview on Tuesday at 9:00 AM. Is that correct?
Candidate: Yes, that works for me.
System: Great! Your interview has been scheduled. You will receive a confirmation email shortly. Thank you for your time.',
'{"interested": true, "notice_period": 45, "current_ctc": 95000, "expected_ctc": 120000, "interview_slot": "2025-05-01T09:00:00Z"}',
NOW()),

('66667777-8888-9999-0000-111122223333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'System: Hello Emily, this is Company regarding a UI/UX Designer opportunity.
Candidate: Hello, I''m interested.
System: What is your current notice period?
Candidate: My notice period is 30 days.
System: Can you share your current and expected CTC?
Candidate: I''m currently at 70,000 and expecting 95,000.
System: When are you available for an interview next week?
Candidate: I could do Wednesday at 11 AM.
System: We''ve scheduled your interview on Wednesday at 11:00 AM. Is that correct?
Candidate: Yes, perfect.
System: Great! Your interview has been scheduled. You will receive a confirmation email shortly. Thank you for your time.',
'{"interested": true, "notice_period": 30, "current_ctc": 70000, "expected_ctc": 95000, "interview_slot": "2025-05-01T11:00:00Z"}',
NOW());