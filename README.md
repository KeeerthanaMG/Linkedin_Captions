# LinkedIn Caption Generator 🚀

An AI-powered web application that generates engaging LinkedIn captions for events, conferences, and professional occasions using Google's Gemini AI.

## ✨ Features

- **Smart Caption Generation**: AI-powered captions tailored to your event type and audience
- **Customizable Parameters**: 
  - Event type/category selection
  - Caption length (short, medium, long)
  - Professional vibe adjustment (formal to casual)
  - Multi-language support
- **Real-time Backend Status**: Live connection monitoring with health checks
- **Responsive Design**: Modern UI with Tailwind CSS
- **Copy to Clipboard**: Easy sharing functionality
- **Form Validation**: Comprehensive input validation with helpful feedback

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons

### Backend
- **Django 4.2** - Python web framework
- **Django REST Framework** - API development
- **Google Gemini AI** - AI text generation
- **CORS Headers** - Cross-origin request handling

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+
- Google Gemini API Key

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Linkedin_Captions
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit .env file with your API keys (see Configuration section)

# Run migrations
python manage.py migrate

# Start development server
python manage.py runserver
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://127.0.0.1:8000

## ⚙️ Configuration

### Environment Variables (.env)
Create a `.env` file in the `backend` directory:

```env
# Django Configuration
DJANGO_SECRET_KEY=your-super-secret-django-key-here
DEBUG=True

# Google Gemini API Configuration
GEMINI_API_KEY=your-gemini-api-key-here

# Optional: Database Configuration
# DATABASE_URL=sqlite:///db.sqlite3

# Optional: CORS Configuration
# ALLOWED_HOSTS=127.0.0.1,localhost
```

### Getting Google Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env` file

## 📱 Usage

1. **Fill Event Details**:
   - Event/Occasion name
   - Event type (Conference, Workshop, Networking, etc.)
   - Location/Context
   - Key people involved
   - Highlights and key learnings

2. **Customize Settings**:
   - Choose caption length
   - Adjust professional vibe (0-100 scale)
   - Select language

3. **Generate Caption**:
   - Click "Generate LinkedIn Caption"
   - Review and customize the generated content
   - Copy to clipboard for LinkedIn posting

## 🏗️ Project Structure

```
Linkedin_Captions/
├── backend/                 # Django backend
│   ├── caption_generator/   # Main Django app
│   ├── linkedin_captions/   # Django project settings
│   ├── requirements.txt     # Python dependencies
│   ├── .env                # Environment variables
│   └── manage.py           # Django management script
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   └── App.jsx         # Main app component
│   ├── package.json        # Node dependencies
│   └── vite.config.js      # Vite configuration
├── README.md              # This file
├── LICENSE                # MIT License
└── .gitignore            # Git ignore rules
```

## 🔧 Development

### Available Scripts

#### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

#### Backend
```bash
python manage.py runserver    # Start development server
python manage.py migrate      # Run database migrations
python manage.py test         # Run tests
```

### API Endpoints
- `GET /api/health/` - Health check endpoint
- `POST /api/generate-caption/` - Generate LinkedIn caption

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Common Issues

**Backend Connection Issues**:
- Ensure Django server is running on `http://127.0.0.1:8000`
- Check if `.env` file exists with proper API key
- Verify firewall settings aren't blocking the connection

**API Key Issues**:
- Ensure Gemini API key is valid and active
- Check API quota and billing settings in Google Cloud Console

**Frontend Build Issues**:
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility

## 🙏 Acknowledgments

- Google Gemini AI for powerful text generation
- React and Django communities for excellent frameworks
- Tailwind CSS for beautiful styling utilities

## 📞 Support

For support, please create an issue in the repository or contact the maintainers.

---

**Happy Caption Generating! 🎉**