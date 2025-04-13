# Voice-Agent for Interview Scheduling

A voice-driven application that automates the interview scheduling process by calling candidates, collecting key details, and booking appointments using natural language conversation.

## Project Overview

This project is a comprehensive full-stack application designed to:

- Automate candidate outreach through voice interactions
- Collect key candidate information (notice period, CTC, availability)
- Schedule interviews based on available slots
- Provide a dashboard for managing the entire process

The application uses speech processing and dialogue management to create a natural, conversational experience.

## Tech Stack

### Backend
- Node.js with Express
- PostgreSQL with Sequelize ORM
- Mozilla TTS for text-to-speech
- Vosk API for speech-to-text
- Rasa/Mycroft for dialogue management

### Frontend
- React.js
- Tailwind CSS
- Web Speech API
- Chart.js for data visualization
- React Router for navigation

## Repository Structure

```
interview-scheduler/
├── backend/             # Node.js + Express backend
├── frontend/            # React.js frontend
└── README.md            # This file
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/Hmtgit7/Voice-Agent.git
cd Voice-Agent
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory with your database credentials and other environment variables (see `.env.example`)

5. Create a `.env` file in the frontend directory to configure the API URL

### Running the Application

#### Development Mode

1. Start the backend server
```bash
cd backend
npm run dev
```

2. Start the frontend development server
```bash
cd frontend
npm start
```

3. Access the application at `http://localhost:3000`

#### Production Mode

1. Build the frontend
```bash
cd frontend
npm run build
```

2. Start the backend server
```bash
cd backend
npm start
```

3. Access the application at the configured port (default: `http://localhost:5000`)

## Features

- **Admin Dashboard**: Monitor candidate responses and appointment status
- **Job Management**: Create, update, and delete job listings with available interview slots
- **Candidate Management**: Track candidate information and interview progress
- **Appointment Scheduling**: Automatically book appointments based on candidate preferences
- **Voice Testing**: Simulate voice interactions using browser-based Web Speech API
- **Dark/Light Theme**: Support for user preference with smooth transitions

## Contribution

Feel free to contribute to this project by creating issues or submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

- [Hmtgit7](https://github.com/Hmtgit7)

## Acknowledgements

- Mozilla TTS
- Vosk API
- Web Speech API
- Tailwind CSS