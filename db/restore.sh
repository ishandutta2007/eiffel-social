#!/bin/sh
# Usage: docker exec -it eiffel-social-db /db/restore.sh
/bin/zcat /db/db.sql.gz | /usr/local/bin/psql $DB_URL > /dev/null
