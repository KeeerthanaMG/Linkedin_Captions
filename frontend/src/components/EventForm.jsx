import React from 'react';
import { MapPin, Users, Lightbulb, Calendar, Loader2 } from 'lucide-react';

const EventForm = ({ formData, onChange, isValid, onGenerate, isGenerating, error, backendStatus }) => {
  const eventTypes = [
    'Hackathon', 'Workshop', 'Conference', 'Meetup', 'Webinar', 
    'Project Launch', 'Achievement', 'Networking Event', 'Other'
  ];

  const handleInputChange = (field, value) => {
    onChange({ [field]: value });
  };

  return (
    <div className="bg-white rounded-2xl linkedin-shadow p-6 space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Tell us about your event
        </h2>
        <p className="text-gray-600">
          Fill in the details to generate your perfect LinkedIn caption
        </p>
      </div>

      <div className="space-y-4">
        {/* Event Name */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Calendar className="w-4 h-4 mr-2 text-primary" />
            Event Name *
          </label>
          <input
            type="text"
            value={formData.eventName}
            onChange={(e) => handleInputChange('eventName', e.target.value)}
            placeholder="e.g., TechCrunch Disrupt 2024"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg input-focus"
          />
        </div>

        {/* Event Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Event Type *
          </label>
          <select
            value={formData.eventType}
            onChange={(e) => handleInputChange('eventType', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg input-focus"
          >
            <option value="">Select event type</option>
            {eventTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <MapPin className="w-4 h-4 mr-2 text-primary" />
            Location *
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="e.g., Chennai, Tamil Nadu"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg input-focus"
          />
        </div>

        {/* Speakers */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Users className="w-4 h-4 mr-2 text-primary" />
            Speakers/Presenters *
          </label>
          <input
            type="text"
            value={formData.speakers}
            onChange={(e) => handleInputChange('speakers', e.target.value)}
            placeholder="e.g., John Doe, Jane Smith"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg input-focus"
          />
        </div>

        {/* Key Learnings */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Lightbulb className="w-4 h-4 mr-2 text-primary" />
            Key Learnings/Takeaways *
          </label>
          <textarea
            value={formData.keyLearnings}
            onChange={(e) => handleInputChange('keyLearnings', e.target.value)}
            placeholder="e.g., AI trends, networking tips, new technologies (separate with commas)"
            rows="3"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg input-focus resize-none"
          />
        </div>

        {/* Caption Settings */}
        <div className="bg-linkedin-50 rounded-lg p-4 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Caption Settings</h3>
          
          {/* Length */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Length</label>
            <div className="flex space-x-2">
              {['short', 'medium', 'long'].map(length => (
                <button
                  key={length}
                  onClick={() => handleInputChange('length', length)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                    formData.length === length
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {length}
                </button>
              ))}
            </div>
          </div>

          {/* Vibe Slider */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Vibe: {formData.vibe <= 33 ? 'Formal' : formData.vibe <= 66 ? 'Casual' : 'GenZ'} ({formData.vibe})
            </label>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                value={formData.vibe}
                onChange={(e) => handleInputChange('vibe', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #0a66c2 0%, #70b5f9 ${formData.vibe}%, #e2e8f0 ${formData.vibe}%, #e2e8f0 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Formal (0)</span>
                <span>Casual (50)</span>
                <span>GenZ (100)</span>
              </div>
            </div>
          </div>

          {/* Language */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Language Style</label>
            <div className="flex space-x-2">
              {[
                { key: 'english', label: 'English' },
                { key: 'tanglish', label: 'Tanglish' }
              ].map(lang => (
                <button
                  key={lang.key}
                  onClick={() => handleInputChange('language', lang.key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    formData.language === lang.key
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0"></div>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <div className="pt-4">
          <button
            onClick={onGenerate}
            disabled={!isValid || isGenerating || backendStatus === 'disconnected'}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
              isValid && !isGenerating && backendStatus !== 'disconnected'
                ? 'btn-primary linkedin-shadow hover:shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isGenerating ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating Caption...</span>
              </div>
            ) : backendStatus === 'disconnected' ? (
              'Backend Disconnected'
            ) : (
              'Generate Caption'
            )}
          </button>
          
          {!isValid && backendStatus !== 'disconnected' && (
            <p className="text-sm text-gray-500 mt-2 text-center">
              Please fill in all required fields to generate a caption
            </p>
          )}
          
          {backendStatus === 'disconnected' && (
            <p className="text-sm text-red-500 mt-2 text-center">
              Please start the backend server to generate captions
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventForm;
