FROM python:3.12-slim

# Environment variables
ENV PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=HRManagement.settings

# Set working directory
WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    postgresql-client \
    python3-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create Django user
RUN useradd -m -d /app django-user && \
    chown -R django-user:django-user /app

USER django-user

# Install Python dependencies
COPY --chown=django-user:django-user requirements.txt ./
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir psycopg2-binary && \
    pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY --chown=django-user:django-user . .

# Expose application port
EXPOSE 8000

# Use Gunicorn for production
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "HRManagement.wsgi:application"]
