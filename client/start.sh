#!/bin/sh

/bin/cp -n $HOME/src/components/config_TEMPLATE.json $HOME/src/components/config.json
/bin/sed -i "s/\${DOMAIN}/$DOMAIN/" $HOME/src/components/config.json

/usr/local/bin/yarn start
