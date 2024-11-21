# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set environment variables
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /app

# Install dependencies (gcc for psycopg2, libpq-dev for PostgreSQL)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --upgrade pip \
    && pip install django==5.1.2 psycopg2-binary djangorestframework==3.15.2 sqlparse==0.5.1 tzdata==2024.2

# Create a new user to run the application
RUN useradd -m django-user

# Switch to the non-root user
USER django-user

# Copy the current directory contents into the container at /app
# Ensure proper ownership by django-user:django-user
COPY --chown=django-user:django-user . .

# Make sure files are read-only and directories are executable
RUN find . -type f -exec chmod 444 {} \; && \
    find . -type d -exec chmod 555 {} \;

# Expose the port the app runs on
EXPOSE 8000

# Set the environment variable for the Django settings module
ENV DJANGO_SETTINGS_MODULE=hrmanage.settings

# Run the Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
