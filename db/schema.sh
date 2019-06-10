#!/bin/sh
# Usage: docker exec -it eiffel-social-db /db/schema.sh
/usr/local/bin/psql $DB_URL < /db/schema.sql
