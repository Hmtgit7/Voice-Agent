// seed.js
const { sequelize, User, Job, Candidate, Appointment, Conversation } = require('./models');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    console.log('Clearing database...');
    await sequelize.query('TRUNCATE TABLE conversations, appointments, candidates, jobs, users CASCADE;');
    
    console.log('Seeding database...');
    
    // Create users
    const adminPassword = await bcrypt.hash('password123', 10);
    const users = await User.bulkCreate([
      {
        id: '11111111-1111-1111-1111-111111111111',
        name: 'Admin User',
        email: 'admin@example.com',
        password: adminPassword
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        name: 'HR Manager',
        email: 'hr@example.com',
        password: adminPassword
      }
    ]);
    
    // Create jobs with proper JSONB format for available_slots
    const jobs = await Job.bulkCreate([
      {
        id: '33333333-3333-3333-3333-333333333333',
        title: 'Senior React Developer',
        description: 'We are looking for a Senior React Developer to join our team to build cutting-edge web applications.',
        requirements: 'Minimum 5 years of experience with React, strong knowledge of JavaScript, experience with state management like Redux or Context API.',
        available_slots: ['2025-05-01T09:00:00Z', '2025-05-01T14:00:00Z', '2025-05-02T10:00:00Z', '2025-05-02T15:00:00Z', '2025-05-03T11:00:00Z']
      },
      {
        id: '44444444-4444-4444-4444-444444444444',
        title: 'UI/UX Designer',
        description: 'Join our design team to create beautiful and intuitive user interfaces for our products.',
        requirements: 'Minimum 3 years of experience in UI/UX design, proficiency in Figma or Adobe XD, portfolio of previous work required.',
        available_slots: ['2025-05-01T11:00:00Z', '2025-05-01T16:00:00Z', '2025-05-02T09:00:00Z', '2025-05-02T13:00:00Z', '2025-05-03T10:00:00Z']
      },
      {
        id: '55555555-5555-5555-5555-555555555555',
        title: 'Backend Node.js Developer',
        description: 'We need an experienced Node.js developer to enhance our backend services and APIs.',
        requirements: 'Minimum 4 years of experience with Node.js and Express, knowledge of RESTful API design, experience with databases.',
        available_slots: ['2025-05-01T10:00:00Z', '2025-05-01T15:00:00Z', '2025-05-02T11:00:00Z', '2025-05-02T16:00:00Z', '2025-05-03T09:00:00Z']
      },
      {
        id: '66666666-6666-6666-6666-666666666666',
        title: 'DevOps Engineer',
        description: 'Looking for a DevOps engineer to help us automate our deployment processes and improve infrastructure.',
        requirements: 'Experience with CI/CD pipelines, Docker, Kubernetes, and cloud platforms like AWS or Azure.',
        available_slots: ['2025-05-01T13:00:00Z', '2025-05-02T14:00:00Z', '2025-05-03T13:00:00Z']
      },
      {
        id: '77777777-7777-7777-7777-777777777777',
        title: 'Product Manager',
        description: 'Join our team as a Product Manager to help define and execute our product strategy.',
        requirements: 'Minimum 3 years of experience in product management, excellent communication skills, ability to work with technical and non-technical stakeholders.',
        available_slots: ['2025-05-02T12:00:00Z', '2025-05-03T14:00:00Z']
      }
    ]);
    
    // Create candidates
    const candidates = await Candidate.bulkCreate([
      {
        id: '88888888-8888-8888-8888-888888888888',
        name: 'John Doe',
        phone: '+1-555-123-4567',
        email: 'john.doe@example.com',
        current_ctc: 85000,
        expected_ctc: 110000,
        notice_period: 30,
        experience: 5.5,
        status: 'new'
      },
      // Add the rest of the candidates...
    ]);
    
    // Create appointments and conversations similarly
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    process.exit(0);
  }
}

seedDatabase();