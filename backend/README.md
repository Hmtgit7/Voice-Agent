# Voice-Agent Backend

The backend service for the Voice-Agent Interview Scheduling application. This service provides RESTful APIs for job management, candidate tracking, appointment scheduling, and voice agent functionality.

## Technology Stack

- **Runtime Environment**: Node.js
- **Server Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT
- **Voice Processing**: Mozilla TTS, Vosk API
- **Dialogue Management**: Integration-ready for Rasa/Mycroft

## Project Structure

```
backend/
├── config/                 # Database and environment configurations
│   ├── config.js
│   └── db.js
├── controllers/            # Request handlers
│   ├── jobController.js
│   ├── candidateController.js
│   ├── appointmentController.js
│   └── voiceAgentController.js
├── models/                 # Database models
│   ├── index.js
│   ├── Job.js
│   ├── Candidate.js
│   ├── Appointment.js
│   └── Conversation.js
├── routes/                 # API routes
│   ├── jobRoutes.js
│   ├── candidateRoutes.js
│   ├── appointmentRoutes.js
│   └── voiceAgentRoutes.js
├── services/               # Business logic
│   ├── ttsService.js
│   ├── sttService.js
│   ├── dialogueService.js
│   └── entityExtractionService.js
├── middleware/             # Express middleware
│   ├── errorHandler.js
│   └── validateRequest.js
├── utils/                  # Helper utilities
│   ├── responseFormatter.js
│   └── validators.js
├── .env                    # Environment variables (create this)
├── .env.example            # Example environment variables
├── package.json            # Dependencies
└── server.js               # Entry point
```

## Installation

1. Clone the repository and navigate to the backend directory
```bash
git clone https://github.com/Hmtgit7/Voice-Agent.git
cd Voice-Agent/backend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file based on `.env.example`
```bash
cp .env.example .env
```

4. Update the `.env` file with your database credentials and other environment variables

## Database Setup

1. Create a PostgreSQL database
```sql
CREATE DATABASE interview_scheduler;
```

2. The application will automatically create the required tables on startup using Sequelize's sync feature

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## API Endpoints

### Jobs

- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create a new job
- `PUT /api/jobs/:id` - Update a job
- `DELETE /api/jobs/:id` - Delete a job

### Candidates

- `GET /api/candidates` - Get all candidates
- `GET /api/candidates/:id` - Get candidate by ID
- `POST /api/candidates` - Create a new candidate
- `PUT /api/candidates/:id` - Update a candidate
- `DELETE /api/candidates/:id` - Delete a candidate

### Appointments

- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create a new appointment
- `PUT /api/appointments/:id` - Update an appointment
- `DELETE /api/appointments/:id` - Delete an appointment

### Voice Agent

- `POST /api/voice-agent/call` - Initiate a voice call
- `POST /api/voice-agent/process` - Process voice input

## Voice Agent Logic

The voice agent uses a combination of:

1. **Text-to-Speech (TTS)**: Using Mozilla TTS to generate natural-sounding speech
2. **Speech-to-Text (STT)**: Using Vosk API for high-accuracy voice recognition
3. **Dialogue Management**: State-based conversation flow with predefined questions
4. **Entity Extraction**: Pattern recognition to extract key information like:
   - Notice period
   - Current and expected CTC
   - Availability for interviews

## Environment Variables

Create a `.env` file with the following variables:

```
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=postgres
DB_PASS=yourpassword
DB_NAME=interview_scheduler
DB_PORT=5432

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d

# Voice Services
MOZILLA_TTS_URL=http://localhost:5002
VOSK_MODEL_PATH=./models/vosk-model-small-en-us-0.15

# Optional: Twilio for real calls
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

## Deployment

The application can be deployed on:
- Virtual Private Servers (VPS)
- Docker containers
- Cloud platforms like AWS, GCP, or Azure

## Author

- [Hmtgit7](https://github.com/Hmtgit7)