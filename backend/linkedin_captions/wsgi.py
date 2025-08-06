"""
WSGI config for linkedin_captions project.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'linkedin_captions.settings')

application = get_wsgi_application()
