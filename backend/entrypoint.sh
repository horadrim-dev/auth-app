#!/bin/sh

cd /app

python manage.py migrate
rm -r ./staticfiles/CACHE/
python manage.py collectstatic --noinput
chmod 755 $(find ./staticfiles -type d)
chmod 755 $(find ./mediafiles -type d)
chmod 644 $(find ./staticfiles -type f)
chmod 644 $(find ./mediafiles -type f)

exec "$@"
