from django.urls import path
from . import views

urlpatterns = [
    path('generate-caption/', views.generate_caption, name='generate_caption'),
    path('health/', views.health_check, name='health_check'),
    path('analytics/', views.analytics_summary, name='analytics_summary'),
]
