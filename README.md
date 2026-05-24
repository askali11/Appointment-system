# 🏥 Healthcare Appointment Management System

A comprehensive healthcare appointment management platform with AI-powered chatbot, intelligent queue optimization, and real-time waiting time tracking.

## ✨ Features

### 👨‍⚕️ For Patients
- **Easy Appointment Booking**: Browse doctors and schedule appointments
- **Real-time Queue Position**: Know exactly how many patients are ahead of you
- **Estimated Wait Time**: AI-calculated waiting times based on queue
- **Appointment Management**: Reschedule, cancel, or view past appointments
- **AI Chatbot**: 24/7 intelligent assistant for health questions and appointment help
- **Notifications**: Email and SMS reminders for upcoming appointments

### 👨‍⚕️ For Doctors
- **Patient Queue Management**: View all patients in queue with priority levels
- **Optimized Scheduling**: AI-suggested optimal schedule
- **Priority-based Queue**: Urgent/high-priority patients flagged
- **Appointment Details**: Complete patient information and visit reason
- **Real-time Updates**: Automatic queue updates every 30 seconds

### 🤖 AI Features
- **Smart Queue Optimization**: Algorithms to minimize wait times
- **Intelligent Chatbot**: Natural language processing for patient queries
- **Waiting Time Prediction**: ML-based wait time estimation
- **Category Detection**: Automatic categorization of patient questions

## 🛠️ Tech Stack

### Backend
- **Node.js & Express** - REST API server
- **MySQL & Sequelize** - Database ORM
- **JWT** - Authentication & Authorization
- **OpenAI GPT-3.5** - AI Chatbot integration
- **Swagger** - API Documentation

### Frontend
- **React 18** - UI Framework
- **Material-UI** - Component library
- **Axios** - HTTP client
- **React Router** - Navigation

## 📋 Prerequisites

```bash
Node.js >= 14.0.0
MySQL >= 5.7
npm or yarn
```

## 🚀 Installation

### 1. Clone Repository
```bash
git clone https://github.com/askali11/appointment-system.git
cd appointment-system
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```

**Edit `.env`:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=appointment_system
DB_PORT=3306
PORT=5000
JWT_SECRET=your_secret_key
OPENAI_API_KEY=sk-your-openai-key
```

**Create MySQL Database:**
```sql
CREATE DATABASE appointment_system;
```

**Start Backend:**
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

Application runs on `http://localhost:3000`

## 📖 API Documentation

Once backend is running, visit:
```
http://localhost:5000/api-docs
```

### Authentication
```bash
POST /api/auth/register    # Register new user
POST /api/auth/login       # Login user
```

### Appointments
```bash
GET /api/appointments                              # Get all appointments
POST /api/appointments/book                        # Book appointment
GET /api/appointments/:appointmentId/queue-position # Get queue info
GET /api/appointments/doctor/:doctorId/queue      # Get doctor's queue
PATCH /api/appointments/:appointmentId/status     # Update status
```

### Chatbot
```bash
POST /api/chatbot/message   # Send message to AI
GET /api/chatbot/history    # Get chat history
```

## 🔐 Authentication

The system uses JWT (JSON Web Tokens):
1. User registers/logs in
2. Backend returns JWT token
3. Token stored in localStorage
4. Token included in all API requests via `Authorization: Bearer <token>` header

## 🧪 Demo Credentials

**Patient Account:**
- Email: `patient@test.com`
- Password: `password123`

**Doctor Account:**
- Email: `doctor@test.com`
- Password: `password123`

## 📁 Project Structure

```
appointment-system/
├── backend/
│   ├── config/          # Database config
│   ├── models/          # Sequelize models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── utils/           # AI chatbot logic
│   ├── server.js        # Main server file
│   ├── swagger.js       # API documentation
│   └── package.json
│
├── frontend/
│   ├── public/          # Static files
│   ├── src/
│   │   ├── pages/       # React pages
│   │   ├── App.js       # Main app component
│   │   ├── index.js     # React entry point
│   │   └── index.css
│   └── package.json
│
└── README.md
```

## 🎯 Usage Guide

### For Patients
1. Register or login
2. Go to "Book Appointment"
3. Select doctor and date/time
4. View "My Appointments" to see queue position
5. Use chatbot for any health questions

### For Doctors
1. Register as doctor
2. Login to dashboard
3. Click "My Queue" to see patients
4. Update appointment status as needed
5. Real-time updates every 30 seconds

## 🤖 AI Chatbot Capabilities

The chatbot can help with:
- **Appointments**: "I want to book an appointment"
- **Wait Times**: "How many patients before me?"
- **Health Questions**: "I have symptoms..."
- **Billing**: "How much does this cost?"
- **General Info**: Any healthcare-related question

## 🔧 Configuration

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DB_HOST` | MySQL host |
| `DB_USER` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `DB_NAME` | Database name |
| `PORT` | Server port |
| `JWT_SECRET` | JWT signing key |
| `OPENAI_API_KEY` | OpenAI API key |

## 🐛 Troubleshooting

### Database Connection Error
- Verify MySQL is running
- Check credentials in `.env`
- Ensure database exists

### OpenAI API Error
- Verify API key in `.env`
- Check API quota and billing
- Test API connection

### Port Already in Use
```bash
# Linux/Mac
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

## 📊 Database Schema

### Users Table
- `id` - Primary key
- `firstName`, `lastName` - User name
- `email` - Unique email
- `password` - Hashed password
- `phone` - Contact number
- `role` - patient/doctor/admin
- `specialization` - Doctor's specialization
- `workingHoursStart`, `workingHoursEnd` - Doctor hours

### Appointments Table
- `id` - Primary key
- `patientId` - Foreign key to Users
- `doctorId` - Foreign key to Users
- `appointmentDate` - Appointment time
- `duration` - Duration in minutes
- `reason` - Reason for visit
- `status` - scheduled/in-progress/completed/cancelled
- `priority` - low/medium/high/urgent
- `estimatedWaitTime` - AI-calculated wait time

### ChatMessages Table
- `id` - Primary key
- `userId` - Foreign key to Users
- `message` - User message
- `response` - AI response
- `category` - Message category
- `sentiment` - Sentiment analysis

## 📝 License

MIT License - feel free to use this project for personal and commercial purposes.

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For issues and questions, please create a GitHub issue.

---

**Made with ❤️ for better healthcare management**

Visit API Documentation: `http://localhost:5000/api-docs`