# Use an official Python image
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory inside the container
WORKDIR /app

# Install dependencies and system libraries
RUN apt-get update && apt-get install -y \
    sqlite3 libsqlite3-dev gcc build-essential \
    && apt-get clean

# Copy the requirements file
COPY requirements.txt /app/

# Debug step to verify contents of requirements.txt
RUN cat /app/requirements.txt

# Install Python dependencies
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the project files
COPY . /app/

# Expose Django's default port
EXPOSE 8000

# Run the Django application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
