from django.contrib import admin
from .models import CaptionRequest, CaptionAnalytics


@admin.register(CaptionRequest)
class CaptionRequestAdmin(admin.ModelAdmin):
    list_display = ['event_name', 'event_type', 'success', 'processing_time', 'created_at']
    list_filter = ['success', 'event_type', 'language', 'length', 'created_at']
    search_fields = ['event_name', 'location', 'speakers']
    readonly_fields = ['id', 'created_at', 'processing_time']
    list_per_page = 25
    
    fieldsets = (
        ('Event Information', {
            'fields': ('event_name', 'event_type', 'location', 'speakers')
        }),
        ('Content Details', {
            'fields': ('key_learnings', 'generated_caption')
        }),
        ('Generation Settings', {
            'fields': ('length', 'vibe', 'language')
        }),
        ('Request Details', {
            'fields': ('success', 'error_message', 'processing_time', 'ip_address')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at'),
            'classes': ('collapse',)
        })
    )


@admin.register(CaptionAnalytics)
class CaptionAnalyticsAdmin(admin.ModelAdmin):
    list_display = ['date', 'total_requests', 'successful_requests', 'failed_requests', 'avg_processing_time']
    list_filter = ['date']
    readonly_fields = ['date']
