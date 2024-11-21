FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Install dependencies, clean up, and install Python packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && pip install django==4.2.16 psycopg2-binary \
    && useradd -m django-user

# Switch to the non-root user
USER django-user

# Copy the application files, with read-only permissions for files
COPY --chown=django-user:django-user . .

# Make sure copied files are read-only and directories are executable
RUN find . -type f -exec chmod 444 {} \; && \
    find . -type d -exec chmod 555 {} \;

# Expose port 8000
EXPOSE 8000

# Run the Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
