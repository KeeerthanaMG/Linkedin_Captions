from django.db import models
from django.utils import timezone
import uuid


class CaptionRequest(models.Model):
    """Model to track caption generation requests for analytics"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event_name = models.CharField(max_length=500)
    event_type = models.CharField(max_length=100)
    location = models.CharField(max_length=200)
    speakers = models.TextField()
    key_learnings = models.TextField()
    length = models.CharField(max_length=20, choices=[
        ('short', 'Short'),
        ('medium', 'Medium'),
        ('long', 'Long')
    ])
    vibe = models.IntegerField(help_text="Vibe score from 0-100")
    language = models.CharField(max_length=20, choices=[
        ('english', 'English'),
        ('tanglish', 'Tanglish')
    ])
    generated_caption = models.TextField()
    success = models.BooleanField(default=True)
    error_message = models.TextField(blank=True, null=True)
    processing_time = models.FloatField(help_text="Time taken to generate caption in seconds")
    created_at = models.DateTimeField(default=timezone.now)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.event_name} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"


class CaptionAnalytics(models.Model):
    """Model to track daily analytics"""
    
    date = models.DateField(unique=True)
    total_requests = models.IntegerField(default=0)
    successful_requests = models.IntegerField(default=0)
    failed_requests = models.IntegerField(default=0)
    avg_processing_time = models.FloatField(default=0.0)
    most_popular_event_type = models.CharField(max_length=100, blank=True)
    most_popular_vibe_range = models.CharField(max_length=50, blank=True)
    
    class Meta:
        ordering = ['-date']
        
    def __str__(self):
        return f"Analytics for {self.date}"
