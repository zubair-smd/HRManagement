FROM python:3.9-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && pip install django==4.2.16 psycopg2-binary \
    && useradd -m django-user

USER django-user

COPY --chown=django-user:django-user . .

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]