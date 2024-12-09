FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    DEBUG=True \
    ALLOWED_HOSTS=* \
    DJANGO_SECRET_KEY=)-q*gw@^c7)%0-_c84(5wl@8ecek%n\$4yx_u%02p8ro5&os+^7

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    python3-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

RUN useradd -m django && \
    mkdir -p /app/static /app/media /app/staticfiles && \
    chown -R django:django /app

COPY . .
RUN chown -R django:django /app && \
    chmod -R 755 /app && \
    chmod 777 /app /app/staticfiless

USER django
EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "HRManagement.wsgi:application"]