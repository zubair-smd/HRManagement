# Use Python 3.12 slim base image
FROM python:3.12-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    DJANGO_SETTINGS_MODULE=core.settings

# Set working directory
WORKDIR /app

# Install system dependencies in a single layer
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        gcc \
        libpq-dev \
        python3-dev \
        && apt-get clean \
        && rm -rf /var/lib/apt/lists/*

# Create and switch to non-root user
RUN useradd -m -d /app django-user && \
    chown -R django-user:django-user /app
USER django-user

# Install Python packages
COPY --chown=django-user:django-user requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY --chown=django-user:django-user . .

# Collect static files
RUN mkdir -p staticfiles media && \
    python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]