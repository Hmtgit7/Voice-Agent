# Voice-Agent Frontend

The frontend application for the Voice-Agent Interview Scheduling system. This React application provides a modern, responsive UI for managing jobs, candidates, and appointments, as well as a voice testing interface.

## Technology Stack

- **Framework**: React.js
- **State Management**: React Context API
- **Routing**: React Router
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Headless UI
- **Icons**: Heroicons
- **Forms**: Custom form hooks
- **Voice Integration**: Web Speech API
- **Charts**: Chart.js with React-Chartjs-2
- **Date Handling**: Date-fns
- **HTTP Client**: Axios

## Project Structure

```
frontend/
├── public/                 # Static files
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── assets/             # Assets (styles, images)
│   │   ├── images/
│   │   └── styles/
│   │       └── tailwind.css
│   ├── components/         # React components
│   │   ├── common/         # Reusable UI components
│   │   ├── dashboard/      # Dashboard-specific components
│   │   ├── jobs/           # Job-related components
│   │   ├── candidates/     # Candidate-related components
│   │   ├── appointments/   # Appointment-related components
│   │   └── voiceAgent/     # Voice agent components
│   ├── contexts/           # React contexts (state management)
│   │   ├── AuthContext.js
│   │   ├── ThemeContext.js
│   │   └── ToastContext.js
│   ├── hooks/              # Custom React hooks
│   │   ├── useApi.js
│   │   ├── useForm.js
│   │   ├── useLocalStorage.js
│   │   └── useWebSpeech.js
│   ├── layouts/            # Page layouts
│   │   ├── AuthLayout.js
│   │   ├── DashboardLayout.js
│   │   └── MainLayout.js
│   ├── pages/              # Application pages
│   │   ├── Dashboard.js
│   │   ├── Jobs.js
│   │   ├── Candidates.js
│   │   ├── Appointments.js
│   │   ├── VoiceTest.js
│   │   ├── Login.js
│   │   └── NotFound.js
│   ├── services/           # API service functions
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── jobService.js
│   │   ├── candidateService.js
│   │   ├── appointmentService.js
│   │   └── voiceAgentService.js
│   ├── utils/              # Utility functions
│   │   ├── dateUtils.js
│   │   ├── formatters.js
│   │   ├── validators.js
│   │   └── theme.js
│   ├── App.js              # Main application component
│   └── index.js            # Application entry point
├── .env                    # Environment variables (create this)
├── .env.example            # Example environment variables
├── package.json            # Dependencies
├── tailwind.config.js      # Tailwind CSS configuration
└── README.md               # This file
```

## Installation

1. Clone the repository and navigate to the frontend directory
```bash
git clone https://github.com/Hmtgit7/Voice-Agent.git
cd Voice-Agent/frontend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file with your configuration
```bash
cp .env.example .env
```

4. Edit the `.env` file to set your backend API URL
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STORAGE_PREFIX=interview_scheduler
```

## Running the Application

### Development Mode
```bash
npm start
```

This will start the development server on port 3000. You can access the application at `http://localhost:3000`.

### Production Build
```bash
npm run build
```

This will create a production-ready build in the `build` folder.

## Features

### Admin Dashboard
- Overview of jobs, candidates, and appointments
- Statistics and charts
- Recent activity feed
- Interactive calendar

### Jobs Management
- Create and edit job listings
- Define interview time slots
- Job details view
- Associate candidates with jobs

### Candidate Management
- Create and edit candidate profiles
- Track candidate information (notice period, CTC, etc.)
- View candidate conversation history
- Candidate status tracking

### Appointment Scheduling
- Schedule interviews
- View and manage appointments
- Status updates (completed, cancelled, rescheduled)
- Calendar integration

### Voice Agent Testing
- Simulate voice calls using Web Speech API
- Test dialogue flow
- View conversation transcript
- Inspect extracted entities

### Theme Support
- Light and Dark mode
- Theme persistence
- Smooth transitions
- Custom color palette

## Browser Support

The application is compatible with:
- Google Chrome (recommended for voice features)
- Microsoft Edge
- Firefox
- Safari (limited voice feature support)

## Environment Variables

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STORAGE_PREFIX=interview_scheduler
```

## Deployment

The application can be deployed on:
- Static site hosts (Netlify, Vercel, GitHub Pages)
- Traditional web servers (Apache, Nginx)
- CDN services

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Author

- [Hmtgit7](https://github.com/Hmtgit7)