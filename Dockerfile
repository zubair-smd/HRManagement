# Use an official Python runtime as a parent image
FROM python:3.12-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    DEBUG=0

# Set the working directory in the container
WORKDIR /app

# Install system dependencies and PostgreSQL dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        gcc \
        libpq-dev \
        postgresql \
        postgresql-client \
        python3-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy and install requirements separately
COPY requirements.txt /app/
RUN pip install --no-cache-dir psycopg2-binary==2.9.9 && \
    pip install --no-cache-dir -r requirements.txt

# Copy the project code into the container
COPY . /app/

# Expose port 8000
EXPOSE 8000

# Start the application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]