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

  // Check backend health on component mount
  useEffect(() => {
    checkBackendHealth();
  }, []);

  // ...existing form validation useEffect...
  useEffect(() => {
    const { eventName, eventType, location, speakers, keyLearnings } = formData;
    setIsFormValid(
      eventName.trim() !== '' &&
      eventType.trim() !== '' &&
      location.trim() !== '' &&
      speakers.trim() !== '' &&
      keyLearnings.trim() !== ''
    );
  }, [formData]);

  const checkBackendHealth = async () => {
    try {
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
    setError(''); // Clear any previous errors when form changes
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError('');
    
    console.log('🎯 Starting caption generation...');
    console.log('📤 Form data:', formData);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/generate-caption/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventName: formData.eventName,
          eventType: formData.eventType,
          location: formData.location,
          speakers: formData.speakers,
          keyLearnings: formData.keyLearnings,
          length: formData.length,
          vibe: formData.vibe,
          language: formData.language
        })
      });

      console.log('📡 Response status:', response.status);
      
      const data = await response.json();
      console.log('📥 Response data:', data);

      if (response.ok && data.success) {
        setGeneratedCaption(data.caption);
        console.log('🎉 Caption generated successfully!');
      } else {
        throw new Error(data.error || data.debug_message || 'Failed to generate caption');
      }
      
    } catch (error) {
      console.error('💥 Caption generation failed:', error);
      setError(error.message);
      
      // Show user-friendly error messages
      if (error.message.includes('Failed to fetch')) {
        setError('Cannot connect to the backend. Please make sure the Django server is running on http://127.0.0.1:8000');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-linkedin-50 via-white to-linkedin-100">
      <div className="absolute inset-0 gradient-bg opacity-5"></div>
      
      <div className="relative z-10">
        <Header backendStatus={backendStatus} />
        
        {/* Backend Status Alert */}
        {backendStatus === 'disconnected' && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4 rounded">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  ⚠️ Backend server is not running. Please start the Django server with: 
                  <code className="bg-red-100 px-2 py-1 rounded ml-2">python manage.py runserver</code>
                </p>
              </div>
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
