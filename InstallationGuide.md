# ReMe Core Installation guide

## Server 

### requires 

Node.js 16.14+
MongoDB
Nginx - as an ssl proxy server

Should listen on port 8000 and redirect to localhost:5678

Letsencrypt - for ssl certificate



Create Unix user live

### Application directory

~live/reme-care

### Start up commands

export NODE_ENV="live"
logfile=`pwd`/logs/remecore_$NODE_ENV"_"`date "+%y%m%d:%H:%M:%S"`.log
forever start -l $logfile server.js





## Ports 

Incoming 8000
