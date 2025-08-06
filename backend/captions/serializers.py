from rest_framework import serializers


class CaptionRequestSerializer(serializers.Serializer):
    """Serializer for caption generation requests"""
    
    eventName = serializers.CharField(
        max_length=500, 
        min_length=3,
        error_messages={
            'min_length': 'Event name must be at least 3 characters long',
            'max_length': 'Event name cannot exceed 500 characters'
        }
    )
    eventType = serializers.CharField(
        max_length=100,
        error_messages={
            'blank': 'Event type is required'
        }
    )
    location = serializers.CharField(
        max_length=200,
        min_length=2,
        error_messages={
            'min_length': 'Location must be at least 2 characters long',
            'max_length': 'Location cannot exceed 200 characters'
        }
    )
    speakers = serializers.CharField(
        min_length=2,
        error_messages={
            'min_length': 'Please mention at least some key people involved'
        }
    )
    keyLearnings = serializers.CharField(
        min_length=10,
        error_messages={
            'min_length': 'Please provide more detailed highlights (at least 10 characters)'
        }
    )
    length = serializers.ChoiceField(
        choices=['short', 'medium', 'long'],
        default='medium'
    )
    vibe = serializers.IntegerField(
        min_value=0,
        max_value=100,
        default=50
    )
    language = serializers.ChoiceField(
        choices=['english', 'tanglish'],
        default='english'
    )
    
    def validate(self, data):
        """Additional validation logic"""
        # Validate event name doesn't contain only special characters
        if not any(c.isalnum() for c in data['eventName']):
            raise serializers.ValidationError({
                'eventName': 'Event name must contain at least some alphanumeric characters'
            })
        
        # Validate key learnings has meaningful content
        if len(data['keyLearnings'].split()) < 3:
            raise serializers.ValidationError({
                'keyLearnings': 'Please provide more detailed highlights with at least 3 words'
            })
        
        return data


class CaptionResponseSerializer(serializers.Serializer):
    """Serializer for caption generation responses"""
    
    success = serializers.BooleanField()
    caption = serializers.CharField(required=False)
    error = serializers.CharField(required=False)
    debug_message = serializers.CharField(required=False)
    processing_time = serializers.FloatField(required=False)
    request_id = serializers.UUIDField(required=False)


class HealthCheckSerializer(serializers.Serializer):
    """Serializer for health check responses"""
    
    status = serializers.CharField()
    message = serializers.CharField()
    timestamp = serializers.DateTimeField()
    version = serializers.CharField()
    gemini_api_configured = serializers.BooleanField()
