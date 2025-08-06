import React from 'react';
import { MapPin, Users, Lightbulb, Calendar, Loader2, Trophy, Briefcase, Heart } from 'lucide-react';

const EventForm = ({ formData, onChange, isValid, onGenerate, isGenerating, error, backendStatus }) => {
  const eventTypes = [
    'Hackathon', 'Workshop', 'Conference', 'Meetup', 'Webinar',
    'Project Launch', 'Achievement', 'Networking Event', 'Competition',
    'Award Ceremony', 'Team Building', 'Product Demo', 'Panel Discussion',
    'Startup Pitch', 'Job Fair', 'Mentorship Session', 'Community Event',
    'Training Session', 'Celebration', 'Announcement', 'Collaboration',
    'Volunteer Work', 'Charity Event', 'Other'
  ];

  const handleInputChange = (field, value) => {
    onChange({ [field]: value });
  };

  return (
    <div className="bg-white rounded-2xl linkedin-shadow p-6 space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Create Your Perfect LinkedIn Caption
        </h2>
        <p className="text-gray-600">
          Your instant go-to platform for generating engaging LinkedIn content for any occasion
        </p>
      </div>

      <div className="space-y-4">
        {/* Event/Occasion Name */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Calendar className="w-4 h-4 mr-2 text-primary" />
            Event/Occasion Name *
          </label>
          <input
            type="text"
            value={formData.eventName}
            onChange={(e) => handleInputChange('eventName', e.target.value)}
            placeholder="e.g., TechCrunch Disrupt 2024, My Team's Project Launch, Annual Hackathon"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg input-focus"
          />
          <p className="text-xs text-gray-500">
            Can be an event, achievement, project, or any occasion you want to share
          </p>
        </div>

        {/* Event Type */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Trophy className="w-4 h-4 mr-2 text-primary" />
            Type/Category *
          </label>
          <select
            value={formData.eventType}
            onChange={(e) => handleInputChange('eventType', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg input-focus"
          >
            <option value="">Select type/category</option>
            {eventTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500">
            Choose the category that best describes your post
          </p>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <MapPin className="w-4 h-4 mr-2 text-primary" />
            Location/Context *
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="e.g., Chennai, Virtual Event, My Office, IIT Madras, Remote"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg input-focus"
          />
          <p className="text-xs text-gray-500">
            Physical location, platform, or context where this happened
          </p>
        </div>

        {/* Key People */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Users className="w-4 h-4 mr-2 text-primary" />
            Key People Involved *
          </label>
          <input
            type="text"
            value={formData.speakers}
            onChange={(e) => handleInputChange('speakers', e.target.value)}
            placeholder="e.g., John Doe (CEO), My teammates Sarah & Mike, Jury members, Event organizers"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg input-focus"
          />
          <p className="text-xs text-gray-500">
            Speakers, teammates, jury, mentors, colleagues, or anyone worth mentioning
          </p>
        </div>

        {/* Key Highlights */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Lightbulb className="w-4 h-4 mr-2 text-primary" />
            Key Highlights/Content *
          </label>
          <textarea
            value={formData.keyLearnings}
            onChange={(e) => handleInputChange('keyLearnings', e.target.value)}
            placeholder="e.g., AI trends I learned, amazing people I networked with, skills I developed, challenges we overcame, technologies we used, insights gained, memorable moments"
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg input-focus resize-none"
          />
          <p className="text-xs text-gray-500">
            Learnings, achievements, people you met, experiences, or anything you want to highlight (separate multiple points with commas)
          </p>
        </div>

        {/* Caption Settings */}
        <div className="bg-linkedin-50 rounded-lg p-4 space-y-4">
          <h3 className="flex items-center text-lg font-semibold text-gray-900">
            <Briefcase className="w-5 h-5 mr-2 text-primary" />
            Caption Settings
          </h3>

          {/* Length */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Caption Length</label>
            <div className="flex space-x-2">
              {{
                short: 'Short',
                medium: 'Medium',
                long: 'Long'
              }[formData.length]}
            </div>
          </div>

          {/* Vibe Slider */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Tone: {formData.vibe <= 33 ? 'Professional' : formData.vibe <= 66 ? 'Casual' : 'GenZ'} ({formData.vibe}/100)
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
                <span>Professional</span>
                <span>Casual</span>
                <span>GenZ</span>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Adjust the tone from formal corporate to trendy GenZ style
            </p>
          </div>

          {/* Language */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Language Style</label>
            <div className="flex space-x-2">
              {{
                english: 'English',
                tanglish: 'Tanglish'
              }[formData.language]}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0 mt-0.5"></div>
              <div className="flex-1">
                <p className="text-red-700 text-sm font-medium mb-1">Error generating caption</p>
                <p className="text-red-600 text-sm">{error}</p>
                {error.includes('connect') && (
                  <p className="text-red-500 text-xs mt-2">
                    💡 Make sure your backend server is running and accessible
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <div className="pt-4">
          <button
            onClick={onGenerate}
            disabled={!isValid || isGenerating || backendStatus === 'disconnected'}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 ${isValid && !isGenerating && backendStatus !== 'disconnected'
                ? 'btn-primary linkedin-shadow hover:shadow-lg transform hover:-translate-y-0.5'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Crafting your perfect caption...</span>
              </>
            ) : backendStatus === 'disconnected' ? (
              <>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span>Backend Disconnected</span>
              </>
            ) : (
              <>
                <Heart className="w-5 h-5" />
                <span>Generate My Caption</span>
              </>
            )}
          </button>

          {!isValid && backendStatus !== 'disconnected' && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-700 text-center font-medium">
                📝 Please fill in all required fields to generate your caption
              </p>
              <p className="text-xs text-yellow-600 text-center mt-1">
                All fields marked with * are required
              </p>
            </div>
          )}

          {backendStatus === 'disconnected' && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 text-center font-medium">
                🔧 Backend server is not connected
              </p>
              <p className="text-xs text-red-600 text-center mt-1">
                Please start the Django server to generate captions
              </p>
            </div>
          )}

          {backendStatus === 'connected' && isValid && !isGenerating && (
            <p className="text-xs text-green-600 text-center mt-2 flex items-center justify-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Ready to generate your amazing LinkedIn caption!</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventForm;
