import google.generativeai as genai
import random
import time
import logging
from typing import Dict, Any, Optional
from django.conf import settings

logger = logging.getLogger(__name__)


class LinkedInCaptionGenerator:
    """
    Advanced LinkedIn Caption Generator using Google Gemini AI
    Focuses on creating engaging, professional captions with proper structure
    """
    
    def __init__(self):
        """Initialize the generator with Gemini AI"""
        self.api_key = settings.GEMINI_API_KEY
        if not self.api_key:
            raise ValueError("Gemini API key not configured")
        
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Hook templates for different vibes
        self.hooks = {
            'professional': [
                "Just wrapped up an incredible experience at {event}...",
                "Key insights from {event} that every professional should know:",
                "What I learned from {event} will change how I approach {field}:",
                "The most valuable takeaway from {event}:",
                "Three game-changing insights from {event}:",
            ],
            'casual': [
                "Had an amazing time at {event}! 🚀",
                "Just got back from {event} and wow...",
                "Feeling inspired after {event}! ✨",
                "What a journey at {event}! 💫",
                "Still processing everything from {event}...",
            ],
            'genz': [
                "Y'all, {event} just hit different! 🔥",
                "Not me getting emotional about {event}... 😭✨",
                "The {event} experience was absolutely unmatched! 💯",
                "POV: You just attended the most incredible {event} 🎯",
                "Tell me why {event} just changed my whole perspective 🤯",
            ]
        }
        
        # Closing templates
        self.closings = {
            'professional': [
                "Looking forward to implementing these insights!",
                "Excited to apply these learnings in my journey ahead.",
                "Ready to put these insights into action!",
                "Can't wait to share more updates on this journey.",
                "Onwards and upwards! 🚀",
            ],
            'casual': [
                "More updates coming soon! 📈",
                "Excited for what's next! 🌟",
                "The journey continues! 💪",
                "Stay tuned for more adventures! ✨",
                "Grateful for this incredible experience! 🙏",
            ],
            'genz': [
                "The glow up is real! ✨💅",
                "Main character energy activated! 💫",
                "Living my best life, one event at a time! 🌟",
                "Plot twist: This was just the beginning! 📈",
                "No cap, this was life-changing! 💯",
            ]
        }
    
    def _determine_vibe_category(self, vibe_score: int) -> str:
        """Determine vibe category based on score"""
        if vibe_score <= 33:
            return 'professional'
        elif vibe_score <= 66:
            return 'casual'
        else:
            return 'genz'
    
    def _get_length_guidelines(self, length: str) -> str:
        """Get length guidelines for the caption"""
        guidelines = {
            'short': "Keep it concise and punchy (100-200 words). Focus on 1-2 key points.",
            'medium': "Provide good detail while staying engaging (200-400 words). Cover 2-3 key points.",
            'long': "Create a comprehensive post (400-600 words). Cover multiple points with detailed insights."
        }
        return guidelines.get(length, guidelines['medium'])
    
    def _create_advanced_prompt(self, data: Dict[str, Any]) -> str:
        """Create sophisticated prompt for high-quality caption generation"""
        
        vibe_category = self._determine_vibe_category(data['vibe'])
        length_guide = self._get_length_guidelines(data['length'])
        
        # Create context-aware field detection
        event_type = data['eventType'].lower()
        field_context = self._detect_field_context(event_type, data['keyLearnings'])
        
        # Language-specific instructions
        language_instruction = ""
        if data['language'] == 'tanglish':
            language_instruction = """
            - Mix English with Tamil words naturally (like 'vera level', 'semma', 'thala', etc.)
            - Use casual Indian English expressions
            - Keep it authentic and relatable to Indian audience
            """
        
        prompt = f"""
You are an expert LinkedIn content creator specializing in viral, engaging posts. Create a compelling LinkedIn caption that will maximize engagement and reach.

**EVENT DETAILS:**
- Event/Occasion: {data['eventName']}
- Type: {data['eventType']}
- Location: {data['location']}
- Key People: {data['speakers']}
- Highlights/Learnings: {data['keyLearnings']}

**STYLE REQUIREMENTS:**
- Vibe: {vibe_category.title()} (Score: {data['vibe']}/100)
- Length: {data['length']} - {length_guide}
- Language: {data['language'].title()}
{language_instruction}
- Field Context: {field_context}

**STRUCTURE REQUIREMENTS:**
1. **HOOK** (First 1-2 lines): Create an attention-grabbing opener that makes people want to read more
2. **STORY/CONTEXT** (2-3 lines): Brief context about the event/experience
3. **KEY INSIGHTS** (Main body): Share 2-3 valuable takeaways or learnings
4. **PERSONAL TOUCH** (1-2 lines): Add personal reflection or emotion
5. **CALL TO ACTION** (Final line): Encourage engagement or connection
6. **HASHTAGS**: 5-8 relevant hashtags

**ENGAGEMENT OPTIMIZATION:**
- Use storytelling elements
- Include specific, actionable insights
- Add relevant emojis (but don't overuse)
- Create curiosity gaps
- Use power words and emotional triggers
- Include industry-relevant keywords naturally

**CRITICAL REQUIREMENTS:**
- Make it unique and original (avoid generic templates)
- Ensure high professional value
- Write in a conversational tone
- Include specific details from the provided information
- Make people want to engage (like, comment, share)
- Optimize for LinkedIn's algorithm

**AVOID:**
- Generic motivational quotes
- Overly salesy language  
- Excessive emoji use
- Clickbait without substance
- Too formal or robotic tone

Generate a caption that would genuinely get high engagement and help establish thought leadership in the {field_context} space.
"""
        
        return prompt
    
    def _detect_field_context(self, event_type: str, key_learnings: str) -> str:
        """Detect the professional field context"""
        tech_keywords = ['ai', 'machine learning', 'tech', 'software', 'coding', 'development', 'startup', 'innovation']
        business_keywords = ['business', 'entrepreneur', 'leadership', 'management', 'strategy', 'marketing']
        academic_keywords = ['research', 'study', 'university', 'academic', 'education', 'learning']
        
        combined_text = f"{event_type} {key_learnings}".lower()
        
        tech_score = sum(1 for keyword in tech_keywords if keyword in combined_text)
        business_score = sum(1 for keyword in business_keywords if keyword in combined_text)
        academic_score = sum(1 for keyword in academic_keywords if keyword in combined_text)
        
        if tech_score > business_score and tech_score > academic_score:
            return "technology/innovation"
        elif business_score > academic_score:
            return "business/entrepreneurship"
        elif academic_score > 0:
            return "academic/research"
        else:
            return "professional development"
    
    def _add_randomization_elements(self, prompt: str) -> str:
        """Add elements to ensure variety in outputs"""
        randomization_note = f"""
        
**UNIQUENESS REQUIREMENT:**
Add these elements to ensure uniqueness (random seed: {random.randint(1000, 9999)}):
- Vary the opening style from your usual patterns
- Choose a different emotional angle or perspective
- Use alternative vocabulary and sentence structures
- Include a unique insight or angle not commonly used
"""
        return prompt + randomization_note
    
    async def generate_caption(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a high-quality LinkedIn caption"""
        start_time = time.time()
        
        try:
            # Create and enhance prompt
            base_prompt = self._create_advanced_prompt(data)
            enhanced_prompt = self._add_randomization_elements(base_prompt)
            
            logger.info(f"Generating caption for event: {data['eventName']}")
            
            # Generate content with Gemini
            response = self.model.generate_content(enhanced_prompt)
            
            if not response.text:
                raise ValueError("Empty response from Gemini API")
            
            caption = response.text.strip()
            processing_time = time.time() - start_time
            
            # Validate caption quality
            if len(caption) < 50:
                raise ValueError("Generated caption too short")
            
            logger.info(f"Caption generated successfully in {processing_time:.2f}s")
            
            return {
                'success': True,
                'caption': caption,
                'processing_time': processing_time,
                'debug_message': f"Generated using {self._determine_vibe_category(data['vibe'])} vibe"
            }
            
        except Exception as e:
            processing_time = time.time() - start_time
            error_msg = f"Caption generation failed: {str(e)}"
            logger.error(error_msg)
            
            return {
                'success': False,
                'error': error_msg,
                'processing_time': processing_time,
                'debug_message': f"Error occurred after {processing_time:.2f}s"
            }
    
    def get_service_status(self) -> Dict[str, Any]:
        """Check service health and status"""
        try:
            # Test API connection with a simple request
            test_response = self.model.generate_content("Test connectivity - respond with 'OK'")
            
            return {
                'status': 'healthy',
                'gemini_configured': bool(self.api_key),
                'api_responsive': bool(test_response.text),
                'last_check': time.time()
            }
        except Exception as e:
            return {
                'status': 'error',
                'gemini_configured': bool(self.api_key),
                'api_responsive': False,
                'error': str(e),
                'last_check': time.time()
            }
