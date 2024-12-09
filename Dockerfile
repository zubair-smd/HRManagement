FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    DEBUG=False \
    ALLOWED_HOSTS="3.251.65.76,localhost,127.0.0.1"

RUN groupadd -r django && \
    useradd -r -g django django && \
    mkdir /app && \
    chown root:root /app && \
    chmod 755 /app && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    libpq-dev \
    postgresql-client \
    procps \
    python3-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements with root ownership and read-only permissions
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy necessary files including the database file
COPY . /app/
COPY /home/ec2-user/hrmanagement/db.sqlite3 /app/db.sqlite3

# Create necessary directories with appropriate permissions
RUN mkdir -p /app/static /app/media && \
    chown -R django:django /app/static /app/media && \
    chmod -R 755 /app/static /app/media

# Switch to non-root user
USER django

# Expose port 8000
EXPOSE 8000

# Start the application
CMD ["gunicorn", "--workers", "3", "--bind", "0.0.0.0:8000", "HRManagement.wsgi:application"]
