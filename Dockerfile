# Use an official Python runtime as a parent image
FROM python:3.12-slim

# Add build argument for Django secret key
ARG DJANGO_SECRET_KEY

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    DEBUG=False \
    DJANGO_SECRET_KEY=${DJANGO_SECRET_KEY} \
    ALLOWED_HOSTS="46.51.134.19,localhost,127.0.0.1"

# Create non-root user and install system dependencies
RUN groupadd -r django && \
    useradd -r -g django django && \
    mkdir /app && \
    chown django:django /app && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        gcc \
        libpq-dev \
        postgresql \
        postgresql-client \
        procps \
        python3-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements first for better caching
COPY --chown=django:django requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the project code
COPY --chown=django:django . /app/

# Create directories, set permissions and collect static files
RUN mkdir -p /app/static /app/media /app/staticfiles /app/templates && \
    chown -R django:django /app && \
    python manage.py collectstatic --noinput

# Switch to non-root user
USER django

# Expose port 8000
EXPOSE 8000

# Start the application
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "HRManagement.wsgi:application"]