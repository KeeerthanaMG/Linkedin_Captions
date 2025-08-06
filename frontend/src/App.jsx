import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import EventForm from './components/EventForm';
import CaptionGenerator from './components/CaptionGenerator';
import Footer from './components/Footer';
import ApiService from './services/api';

function App() {
  const [formData, setFormData] = useState({
    eventName: '',
    eventType: '',
    location: '',
    speakers: '',
    keyLearnings: '',
    length: 'medium',
    vibe: 50,
    language: 'english'
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [generatedCaption, setGeneratedCaption] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [backendStatus, setBackendStatus] = useState('checking');

  // Check backend health on component mount and periodically
  useEffect(() => {
    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Enhanced form validation with detailed feedback
  useEffect(() => {
    const { eventName, eventType, location, speakers, keyLearnings } = formData;

    const isValid =
      eventName.trim().length >= 3 &&
      eventType.trim() !== '' &&
      location.trim().length >= 2 &&
      speakers.trim().length >= 2 &&
      keyLearnings.trim().length >= 10; // Minimum meaningful content

    setIsFormValid(isValid);

    // Clear error when form becomes valid
    if (isValid && error && !error.includes('connect') && !error.includes('Backend')) {
      setError('');
    }
  }, [formData, error]);

  const checkBackendHealth = async () => {
    try {
      setBackendStatus('checking');
      await ApiService.healthCheck();
      setBackendStatus('connected');
      console.log('✅ Backend is connected and healthy');
    } catch (error) {
      setBackendStatus('disconnected');
      console.error('❌ Backend health check failed:', error);
    }
  };

  const handleFormChange = (newData) => {
    setFormData({ ...formData, ...newData });
    // Clear error when user starts typing (except connection errors)
    if (error && !error.includes('connect') && !error.includes('Backend')) {
      setError('');
    }
  };

  const validateFormData = () => {
    const { eventName, eventType, location, speakers, keyLearnings } = formData;

    if (eventName.trim().length < 3) {
      throw new Error('Event/Occasion name must be at least 3 characters long');
    }
    if (!eventType.trim()) {
      throw new Error('Please select an event type/category');
    }
    if (location.trim().length < 2) {
      throw new Error('Location/Context must be at least 2 characters long');
    }
    if (speakers.trim().length < 2) {
      throw new Error('Please mention at least some key people involved');
    }
    if (keyLearnings.trim().length < 10) {
      throw new Error('Please provide more detailed highlights/content (at least 10 characters)');
    }
  };

  const handleGenerate = async () => {
    // Pre-validation
    try {
      validateFormData();
    } catch (validationError) {
      setError(validationError.message);
      return;
    }

    setIsGenerating(true);
    setError('');

    console.log('🎯 Starting caption generation...');
    console.log('📤 Form data:', formData);

    try {
      // Check backend status before making request
      if (backendStatus === 'disconnected') {
        throw new Error('Backend server is not available. Please check your connection and try again.');
      }

      const response = await fetch('http://127.0.0.1:8000/api/generate-caption/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventName: formData.eventName.trim(),
          eventType: formData.eventType.trim(),
          location: formData.location.trim(),
          speakers: formData.speakers.trim(),
          keyLearnings: formData.keyLearnings.trim(),
          length: formData.length,
          vibe: formData.vibe,
          language: formData.language
        })
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        // Handle different HTTP status codes
        if (response.status === 404) {
          throw new Error('Backend endpoint not found. Please check if the Django server is running correctly.');
        } else if (response.status === 500) {
          throw new Error('Internal server error. Please try again in a moment.');
        } else if (response.status === 429) {
          throw new Error('Too many requests. Please wait a moment before trying again.');
        } else {
          throw new Error(`Server responded with status ${response.status}. Please try again.`);
        }
      }

      const data = await response.json();
      console.log('📥 Response data:', data);

      if (data.success && data.caption) {
        setGeneratedCaption(data.caption);
        console.log('🎉 Caption generated successfully!');

        // Clear any previous errors
        setError('');
      } else {
        throw new Error(data.error || data.debug_message || 'Failed to generate caption - no content received');
      }

    } catch (error) {
      console.error('💥 Caption generation failed:', error);

      // Provide user-friendly error messages
      let userMessage = error.message;

      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        userMessage = 'Cannot connect to the backend server. Please ensure the Django server is running on http://127.0.0.1:8000';
        setBackendStatus('disconnected'); // Update status immediately
      } else if (error.message.includes('timeout')) {
        userMessage = 'Request timed out. The server might be busy. Please try again.';
      } else if (error.message.includes('CORS')) {
        userMessage = 'CORS error. Please check if the backend is properly configured for frontend requests.';
      }

      setError(userMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-linkedin-50 via-white to-linkedin-100">
      <div className="absolute inset-0 gradient-bg opacity-5"></div>

      <div className="relative z-10">
        <Header backendStatus={backendStatus} />

        {/* Enhanced Backend Status Alert */}
        {backendStatus === 'disconnected' && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4 rounded shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mt-1"></div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800 mb-2">
                  🔧 Backend Server Connection Issue
                </h3>
                <p className="text-sm text-red-700 mb-2">
                  The caption generation service is currently unavailable.
                </p>
                <div className="text-xs text-red-600 space-y-1">
                  <p>• Make sure the Django server is running: <code className="bg-red-100 px-2 py-1 rounded">python manage.py runserver</code></p>
                  <p>• Check if the server is accessible at: <code className="bg-red-100 px-2 py-1 rounded">http://127.0.0.1:8000</code></p>
                  <p>• Ensure your firewall is not blocking the connection</p>
                </div>
                <button
                  onClick={checkBackendHealth}
                  className="mt-3 px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-800 rounded transition-colors"
                >
                  Retry Connection
                </button>
              </div>
            </div>
          </div>
        )}

        {backendStatus === 'checking' && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-4 mt-4 rounded shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
              <p className="text-sm text-yellow-700">
                Checking backend connection...
              </p>
            </div>
          </div>
        )}

        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="animate-slide-up">
              <EventForm
                formData={formData}
                onChange={handleFormChange}
                isValid={isFormValid}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                error={error}
                backendStatus={backendStatus}
              />
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CaptionGenerator
                caption={generatedCaption}
                isGenerating={isGenerating}
                onRegenerate={handleGenerate}
                formData={formData}
                error={error}
              />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;
