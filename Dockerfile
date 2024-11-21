FROM python:3.12

# Set environment variables with the new format
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Set the working directory in the container
WORKDIR /app

# Install system dependencies and Python dependencies in one layer, sorted alphanumerically
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && pip install --upgrade pip \
    && pip install django==4.2.16 djangorestframework==3.15.2 psycopg2-binary sqlparse==0.5.1 tzdata==2024.2

# Create a new user to run the application
RUN useradd -m django-user

# Switch to the non-root user
USER django-user

# Copy the current directory contents into the container at /app
# Ensure proper ownership by django-user:django-user
COPY --chown=django-user:django-user . /app/

# Install dependencies from requirements.txt (if you have any dependencies specified here)
COPY requirements.txt /app/
RUN pip install -r requirements.txt

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
