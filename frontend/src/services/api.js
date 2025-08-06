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
          eventName: formData.eventName,
          eventType: formData.eventType,
          location: formData.location,
          speakers: formData.speakers,
          keyLearnings: formData.keyLearnings,
          length: formData.length,
          vibe: formData.vibe,
          language: formData.language
        }),
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API Error:', errorData);

        // Handle validation errors specifically
        if (errorData.validation_errors) {
          const validationMessage = Object.entries(errorData.validation_errors)
            .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
            .join('\n');
          throw new Error(`Validation Error:\n${validationMessage}`);
        }

        throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Caption generated successfully:', {
        success: data.success,
        processingTime: data.processing_time,
        requestId: data.request_id
      });

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
