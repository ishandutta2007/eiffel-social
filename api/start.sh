#!/bin/sh

/usr/sbin/crond -b -l 8 -L /var/log/crontab.log
/usr/local/bin/npm run start_dev
