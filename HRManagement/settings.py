import environ
import os
from pathlib import Path
from django.core.exceptions import ImproperlyConfigured


env = environ.Env()

# Build paths
BASE_DIR = Path(__file__).resolve().parent.parent
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

SECRET_KEY = env('DJANGO_SECRET_KEY')
# Initialize environment variables
env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

# # Secret key handling
# try:
#    with open(os.path.join(BASE_DIR, 'secrets.txt')) as f:
#        for line in f:
#            if line.startswith('DJANGO_SECRET_KEY='):
#                SECRET_KEY = line.split('=')[1].strip()
#                break
# except FileNotFoundError:
#    raise ImproperlyConfigured("secrets.txt file not found")
# except Exception as e:
#    raise ImproperlyConfigured(f"Error loading secret key: {str(e)}")

CSRF_TRUSTED_ORIGINS = ['http://localhost:8000', 'http://127.0.0.1:8000', 'http://3.251.65.76:8000']

# Core Settings
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '3.251.65.76']
DEBUG = True
SECURE_SSL_REDIRECT = False

# Application definition
INSTALLED_APPS = [
   'django.contrib.admin',
   'django.contrib.auth',
   'django.contrib.contenttypes',
   'django.contrib.sessions',
   'django.contrib.messages',
   'django.contrib.staticfiles',
   'employees',
   'django_extensions',
]

MIDDLEWARE = [
   'django.middleware.security.SecurityMiddleware',
   'whitenoise.middleware.WhiteNoiseMiddleware',
   'django.contrib.sessions.middleware.SessionMiddleware',
   'django.middleware.common.CommonMiddleware',
   'django.middleware.csrf.CsrfViewMiddleware',
   'django.contrib.auth.middleware.AuthenticationMiddleware',
   'django.contrib.messages.middleware.MessageMiddleware',
   'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'HRManagement.urls'

TEMPLATES = [
   {
       'BACKEND': 'django.template.backends.django.DjangoTemplates',
       'DIRS': [BASE_DIR / 'templates', BASE_DIR / 'employees' / 'templates'],
       'APP_DIRS': True,
       'OPTIONS': {
           'context_processors': [
               'django.template.context_processors.debug',
               'django.template.context_processors.request',
               'django.contrib.auth.context_processors.auth',
               'django.contrib.messages.context_processors.messages',
           ],
       },
   },
]

WSGI_APPLICATION = 'HRManagement.wsgi.application'

# Database configuration
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
   {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',},
   {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',},
   {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',},
   {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',},
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static and Media Files Configuration
# Static and Media Files Configuration
STATIC_URL = '/static/'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'employees/static')
]
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Static files finder configuration
STATICFILES_FINDERS = [
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
]
# Development static file handling
if DEBUG:
   import mimetypes
   mimetypes.add_type("text/css", ".css", True)

# Media files configuration
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Authentication Settings
LOGIN_URL = '/login/'
LOGIN_REDIRECT_URL = '/employees/'
LOGOUT_REDIRECT_URL = '/login/'

# Default Primary Key Field
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Messages Configuration
MESSAGE_STORAGE = 'django.contrib.messages.storage.session.SessionStorage'


# # Production Security Settings
if not DEBUG:
    
    SECURE_SSL_REDIRECT = False
    SESSION_COOKIE_SECURE = False
    CSRF_COOKIE_SECURE = False
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'DENY'
    SESSION_EXPIRE_AT_BROWSER_CLOSE = False
    SESSION_COOKIE_AGE = 86400 

