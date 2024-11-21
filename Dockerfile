FROM python:3.12-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        gcc \
        libpq-dev \
        gunicorn \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create a new user to run the application
RUN useradd -m django-user

# Copy requirements first and install dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir django==4.2.16 \
    djangorestframework==3.15.2 \
    psycopg2-binary \
    sqlparse==0.5.1 \
    tzdata==2024.2 \
    gunicorn

# Switch to the non-root user
USER django-user

# Copy the current directory contents into the container at /app
# Ensure proper ownership by django-user:django-user and no write permissions
COPY --chown=django-user:django-user . /app/
RUN chmod -R 440 /app/* && \
    chmod 550 /app/manage.py && \
    mkdir -p /app/staticfiles /app/media && \
    chmod 550 /app/staticfiles /app/media

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose port
EXPOSE 8000

# Start gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "--timeout", "120", "HRManagement.wsgi:application"]