# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN addgroup --system hrmanagement \
    && adduser --system --ingroup hrmanagement hrmanagement

# Copy requirements first to leverage Docker cache
COPY requirements.txt /app/

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . /app/

# Change ownership of the application directory
RUN chown -R hrmanagement:hrmanagement /app

# Create a directory for static files
RUN mkdir -p /app/staticfiles && \
    chown -R hrmanagement:hrmanagement /app/staticfiles

# Switch to non-root user
USER hrmanagement

# Perform database migrations
RUN python manage.py migrate

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]