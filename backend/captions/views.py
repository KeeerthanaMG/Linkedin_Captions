import asyncio
import logging
import time
from datetime import datetime, timezone
from typing import Dict, Any

from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import CaptionRequest, CaptionAnalytics
from .serializers import CaptionRequestSerializer, CaptionResponseSerializer, HealthCheckSerializer
from .services.caption_generator import LinkedInCaptionGenerator

logger = logging.getLogger(__name__)


# Initialize the caption generator
try:
    caption_generator = LinkedInCaptionGenerator()
    logger.info("✅ Caption generator initialized successfully")
except Exception as e:
    caption_generator = None
    logger.error(f"❌ Failed to initialize caption generator: {e}")


def get_client_ip(request):
    """Get client IP address from request"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


async def run_caption_generation(generator, data: Dict[str, Any]) -> Dict[str, Any]:
    """Run caption generation asynchronously"""
    return await generator.generate_caption(data)


@api_view(['POST'])
def generate_caption(request):
    """
    Generate LinkedIn caption based on provided event data
    """
    start_time = time.time()
    request_id = None
    
    try:
        # Validate caption generator availability
        if not caption_generator:
            return Response({
                'success': False,
                'error': 'Caption generation service is not available. Please check server configuration.',
                'debug_message': 'Gemini API not properly configured'
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
        # Validate request data
        serializer = CaptionRequestSerializer(data=request.data)
        if not serializer.is_valid():
            logger.warning(f"Invalid request data: {serializer.errors}")
            return Response({
                'success': False,
                'error': 'Invalid input data provided',
                'validation_errors': serializer.errors,
                'debug_message': 'Please check all required fields and their formats'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        validated_data = serializer.validated_data
        client_ip = get_client_ip(request)
        
        logger.info(f"🚀 Starting caption generation for: {validated_data['eventName']}")
        
        # Convert camelCase to snake_case for internal processing
        processed_data = {
            'eventName': validated_data['eventName'],
            'eventType': validated_data['eventType'],
            'location': validated_data['location'],
            'speakers': validated_data['speakers'],
            'keyLearnings': validated_data['keyLearnings'],
            'length': validated_data['length'],
            'vibe': validated_data['vibe'],
            'language': validated_data['language']
        }
        
        # Generate caption using asyncio
        try:
            result = asyncio.run(run_caption_generation(caption_generator, processed_data))
        except Exception as e:
            logger.error(f"Caption generation failed: {e}")
            result = {
                'success': False,
                'error': f'Caption generation failed: {str(e)}',
                'processing_time': time.time() - start_time
            }
        
        processing_time = time.time() - start_time
        
        # Save request to database for analytics
        try:
            caption_request = CaptionRequest.objects.create(
                event_name=validated_data['eventName'],
                event_type=validated_data['eventType'],
                location=validated_data['location'],
                speakers=validated_data['speakers'],
                key_learnings=validated_data['keyLearnings'],
                length=validated_data['length'],
                vibe=validated_data['vibe'],
                language=validated_data['language'],
                generated_caption=result.get('caption', ''),
                success=result.get('success', False),
                error_message=result.get('error', ''),
                processing_time=processing_time,
                ip_address=client_ip
            )
            request_id = caption_request.id
            logger.info(f"💾 Request saved with ID: {request_id}")
        except Exception as e:
            logger.error(f"Failed to save request to database: {e}")
        
        # Prepare response
        if result.get('success', False):
            logger.info(f"✅ Caption generated successfully in {processing_time:.2f}s")
            response_data = {
                'success': True,
                'caption': result.get('caption'),
                'processing_time': processing_time,
                'request_id': str(request_id) if request_id else None,
                'debug_message': result.get('debug_message', 'Caption generated successfully')
            }
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            logger.error(f"❌ Caption generation failed: {result.get('error')}")
            response_data = {
                'success': False,
                'error': result.get('error', 'Unknown error occurred'),
                'processing_time': processing_time,
                'request_id': str(request_id) if request_id else None,
                'debug_message': result.get('debug_message', 'Caption generation failed')
            }
            return Response(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    except Exception as e:
        processing_time = time.time() - start_time
        error_message = f"Unexpected error: {str(e)}"
        logger.error(f"🔥 Unexpected error in generate_caption: {e}")
        
        return Response({
            'success': False,
            'error': error_message,
            'processing_time': processing_time,
            'debug_message': 'An unexpected server error occurred'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def health_check(request):
    """
    Health check endpoint to verify service status
    """
    try:
        current_time = datetime.now(timezone.utc)
        
        # Check caption generator status
        if caption_generator:
            service_status = caption_generator.get_service_status()
            gemini_healthy = service_status.get('api_responsive', False)
            gemini_configured = service_status.get('gemini_configured', False)
        else:
            gemini_healthy = False
            gemini_configured = False
        
        # Determine overall health
        overall_status = 'healthy' if (caption_generator and gemini_healthy) else 'unhealthy'
        
        # Get recent statistics
        try:
            total_requests = CaptionRequest.objects.count()
            successful_requests = CaptionRequest.objects.filter(success=True).count()
            success_rate = (successful_requests / total_requests * 100) if total_requests > 0 else 0
        except Exception:
            total_requests = 0
            successful_requests = 0
            success_rate = 0
        
        health_data = {
            'status': overall_status,
            'message': 'Service is operational' if overall_status == 'healthy' else 'Service has issues',
            'timestamp': current_time.isoformat(),
            'version': '1.0.0',
            'gemini_api_configured': gemini_configured,
            'gemini_api_healthy': gemini_healthy,
            'database_accessible': True,  # If we reach here, DB is accessible
            'statistics': {
                'total_requests': total_requests,
                'successful_requests': successful_requests,
                'success_rate': f"{success_rate:.1f}%"
            }
        }
        
        logger.info(f"💚 Health check performed: {overall_status}")
        
        return Response(health_data, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"💔 Health check failed: {e}")
        
        return Response({
            'status': 'error',
            'message': f'Health check failed: {str(e)}',
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'version': '1.0.0',
            'gemini_api_configured': False,
            'gemini_api_healthy': False,
            'database_accessible': False
        }, status=status.HTTP_503_SERVICE_UNAVAILABLE)


@api_view(['GET'])
def analytics_summary(request):
    """
    Get analytics summary (optional endpoint for monitoring)
    """
    try:
        from django.db.models import Avg, Count
        from datetime import date, timedelta
        
        # Get statistics for the last 30 days
        thirty_days_ago = date.today() - timedelta(days=30)
        
        recent_requests = CaptionRequest.objects.filter(
            created_at__date__gte=thirty_days_ago
        )
        
        analytics = {
            'total_requests': recent_requests.count(),
            'successful_requests': recent_requests.filter(success=True).count(),
            'failed_requests': recent_requests.filter(success=False).count(),
            'avg_processing_time': recent_requests.aggregate(
                avg_time=Avg('processing_time')
            )['avg_time'] or 0,
            'popular_event_types': list(
                recent_requests.values('event_type')
                .annotate(count=Count('event_type'))
                .order_by('-count')[:5]
            ),
            'popular_vibes': list(
                recent_requests.values('vibe')
                .annotate(count=Count('vibe'))
                .order_by('-count')[:5]
            ),
            'period': '30 days'
        }
        
        return Response({
            'success': True,
            'analytics': analytics
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"Analytics summary failed: {e}")
        return Response({
            'success': False,
            'error': f'Failed to generate analytics: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
