FROM python:3.9

WORKDIR /app

RUN apt-get update && apt-get install -y gcc libpq-dev && \
    apt-get clean && rm -rf /var/lib/apt/lists/* && \
    pip install django psycopg2-binary

COPY . .

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]