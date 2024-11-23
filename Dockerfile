# Use an official Python runtime as a parent image
FROM python:3.12-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    DEBUG=True \
    DJANGO_SECRET_KEY="django-insecure-lirh1ypw#8&kjb@gql+jp6gd+7s4-ko70k-^7@q0__m_45l2fn" \
    ALLOWED_HOSTS="*"

# Create a non-root user
RUN groupadd -r django && \
    useradd -r -g django django && \
    mkdir /app && \
    chown django:django /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    libpq-dev \
    python3-dev \
    postgresql \
    postgresql-client \
    procps \
    && apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements first for better caching
COPY --chown=django:django requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the project code
COPY --chown=django:django . /app/

# Create necessary directories
RUN mkdir -p /app/static /app/media /app/staticfiles /app/templates && \
    chown -R django:django /app

# Collect static files
RUN python manage.py collectstatic --noinput

# Switch to non-root user
USER django

# Expose port 8000
EXPOSE 8000

# Start the application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]