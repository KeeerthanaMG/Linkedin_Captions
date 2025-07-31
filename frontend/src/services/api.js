const API_BASE_URL = 'http://127.0.0.1:8000/api';

class ApiService {
  async generateCaption(formData) {
    console.log('🚀 Sending caption generation request:', formData);
    
    try {
      const response = await fetch(`${API_BASE_URL}/generate-caption/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_name: formData.eventName,
          event_type: formData.eventType,
          location: formData.location,
          speakers: formData.speakers,
          key_learnings: formData.keyLearnings,
          length: formData.length,
          vibe: formData.vibe,
          language: formData.language
        }),
      });
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API Error:', errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Caption generated successfully');
      return data;
      
    } catch (error) {
      console.error('🔥 Network/API Error:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Unable to connect to the server. Please make sure the backend is running on http://127.0.0.1:8000');
      }
      
      throw error;
    }
  }
  
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health/`);
      const data = await response.json();
      console.log('💚 Backend health check:', data);
      return data;
    } catch (error) {
      console.error('💔 Backend health check failed:', error);
      throw error;
    }
  }
}

export default new ApiService();
