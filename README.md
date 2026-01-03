# Flood Alert & Community Support Platform

> A comprehensive real-time flood monitoring and emergency response system built with MERN stack + TypeScript

A full-stack web application that enables citizens to report flood incidents, request emergency assistance, locate safe shelters, and access AI-powered flood analysis. Built as part of the Rapid Application Development (RAD) coursework.

## Live Demo

**Frontend:** [Coming Soon - Deploy to Vercel]  
**Backend API:** [Coming Soon - Deploy to Render]  
**GitHub Repository:** https://github.com/hirunadissanayake/flood-alert


## Features

### User Features
- **User Authentication**: Secure registration and login using JWT
- **Flood Reporting**: Report floods with location (GPS/manual), water level, photos, and description
- **Real-time Alerts**: View all flood alerts on an interactive map
- **SOS Requests**: Send emergency help requests (rescue, food, medicine, evacuation)
- **Request Tracking**: Monitor rescue request status
- **Safety Status**: Mark yourself as "safe"
- **Community Updates**: Comment and update on flood situations

### Admin Features
- **Report Management**: Manage and verify flood reports
- **SOS Management**: Handle and assign SOS requests
- **Shelter Management**: Update and manage shelter locations
- **Verification System**: Mark and validate verified reports
- **AI Integration**: Generate daily flood summaries and emergency messages

### AI Features (Advanced Feature Requirement)
- **AI Daily Flood Summary**: Analyzes all flood reports and generates comprehensive daily summaries with trends and insights
- **AI Emergency Message Generator**: Creates contextual warning messages for affected communities
- **Smart Analysis**: Processes location data, severity levels, and timestamps to identify high-risk areas
- Powered by OpenAI GPT or Google Gemini API

## Tech Stack

### Frontend
- **React 18** with TypeScript - Modern UI library with type safety
- **Redux Toolkit** - Global state management
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **React Google Maps API** - Interactive map integration
- **Vite** - Fast build tool and dev server

### Backend
- **Node.js** with Express.js - Server runtime and web framework
- **TypeScript** - Static typing for enhanced code quality
- **MongoDB** with Mongoose ODM - NoSQL database with schema modeling
- **JWT (jsonwebtoken)** - Secure authentication tokens
- **bcryptjs** - Password hashing and encryption
- **OpenAI/Gemini API** - AI-powered features
- **CORS** - Cross-origin resource sharing
- **express-validator** - Request validation

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **nodemon** - Auto-restart during development
- **ts-node** - TypeScript execution for Node.js

## Project Structure

```
Project/
├── client/                      # React frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/             # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Reports.tsx
│   │   │   ├── SOSPage.tsx
│   │   │   ├── Shelters.tsx
│   │   │   └── Profile.tsx
│   │   ├── redux/             # State management
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.ts
│   │   │   │   ├── reportSlice.ts
│   │   │   │   ├── sosSlice.ts
│   │   │   │   └── shelterSlice.ts
│   │   │   └── store/
│   │   │       └── index.ts
│   │   ├── services/          # API services
│   │   ├── types/             # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
└── server/                     # Node.js backend
    ├── src/
    │   ├── config/
    │   │   └── database.ts    # MongoDB connection
    │   ├── controllers/       # Route controllers
    │   │   ├── authController.ts
    │   │   ├── reportController.ts
    │   │   ├── sosController.ts
    │   │   ├── shelterController.ts
    │   │   └── aiController.ts
    │   ├── middleware/        # Express middleware
    │   │   ├── auth.ts
    │   │   └── errorHandler.ts
    │   ├── models/           # Mongoose models
    │   │   ├── User.ts
    │   │   ├── FloodReport.ts
    │   │   ├── SOSRequest.ts
    │   │   └── Shelter.ts
    │   ├── routes/           # API routes
    │   │   ├── authRoutes.ts
    │   │   ├── reportRoutes.ts
    │   │   ├── sosRoutes.ts
    │   │   ├── shelterRoutes.ts
    │   │   └── aiRoutes.ts
    │   ├── types/            # TypeScript types
    │   └── server.ts         # Entry point
    ├── package.json
    └── tsconfig.json
```

## Database Schema

### User
- id, name, email, password (hashed)
- role (user/admin)
- phoneNumber, location {lat, lng, address}
- isSafe (boolean)

### FloodReport
- id, userId (ref to User)
- location {lat, lng, address}
- waterLevel (low/medium/high/severe)
- description, imageUrl
- status (pending/verified)
- timestamp

### SOSRequest
- id, userId (ref to User)
- type (rescue/food/medicine/evacuation)
- location {lat, lng, address}
- status (pending/accepted/completed)
- assignedVolunteer (ref to User)
- timestamp

### Shelter
- id, name
- capacity, currentOccupancy
- location {lat, lng, address}
- phone, facilities[]
- isActive

## REST API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/profile` - Update profile (Protected)

### Flood Reports
- `POST /api/reports` - Create report (Protected)
- `GET /api/reports` - Get all reports
- `GET /api/reports/:id` - Get single report
- `PUT /api/reports/:id` - Update report (Protected)
- `DELETE /api/reports/:id` - Delete report (Protected/Admin)

### SOS Requests
- `POST /api/sos` - Create SOS request (Protected)
- `GET /api/sos` - Get all SOS requests (Protected)
- `GET /api/sos/:id` - Get single request (Protected)
- `PUT /api/sos/:id` - Update request (Protected/Admin)

### Shelters
- `POST /api/shelters` - Create shelter (Admin)
- `GET /api/shelters` - Get all shelters
- `GET /api/shelters/:id` - Get single shelter
- `PUT /api/shelters/:id` - Update shelter (Admin)
- `DELETE /api/shelters/:id` - Delete shelter (Admin)

### AI Features
- `POST /api/ai/summary` - Generate flood summary (Admin)
- `POST /api/ai/warning-message` - Generate warning message (Admin)

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- OpenAI API key (for AI features)

### Server Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
AI_API_KEY=your_openai_api_key
AI_PROVIDER=openai
```

5. Start the server:
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

### Client Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage

1. **Register**: Create a new account
2. **Login**: Access the dashboard
3. **Report Flood**: Submit flood reports with location and details
4. **Send SOS**: Request emergency assistance
5. **Find Shelters**: Locate nearby emergency shelters
6. **Admin Features**: Manage reports, requests, and generate AI summaries (admin only)


## Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Protected routes and endpoints
- Role-based access control (RBAC)
- Input validation
- Error handling middleware

## Screenshots

### User Interface

**Dashboard - Flood Reports Overview**
![Dashboard](./screenshots/dashboard.png)
*Main dashboard showing all active flood reports on an interactive map*

**Flood Reporting**
![Report Form](./screenshots/report-form.png)
*Users can report floods with location, severity, and photos*

**SOS Emergency Requests**
![SOS Page](./screenshots/sos-page.png)
*Emergency help requests for rescue, food, medicine, and evacuation*

**Emergency Shelters**
![Shelters](./screenshots/shelters.png)
*Find nearby shelters with capacity and contact information*

### Admin Features

**Admin Dashboard**
![Admin Dashboard](./screenshots/admin-dashboard.png)
*Statistics and overview of all reports and requests*

**AI-Powered Insights**
![AI Insights](./screenshots/ai-insights.png)
*Generate automated flood summaries and emergency messages*

> Note: Screenshots to be added after deployment

## Future Enhancements

- Real-time notifications with WebSocket
- Interactive map with flood zones
- Mobile application (React Native)
- SMS alerts integration
- Multi-language support
- Weather API integration
- Push notifications




