#!/bin/sh
# Usage: docker exec -it eiffel-social-db /db/dump.sh
/usr/local/bin/pg_dump -c $DB_URL | /bin/gzip -9 - > /db/db.sql.gz
