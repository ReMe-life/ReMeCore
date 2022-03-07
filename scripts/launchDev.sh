#! /bin/bash
# kill running node for this user
w=`whoami`; kill -1 `ps -fu$w| grep node | cut -c10-17`
# Start server forever
export NODE_ENV="dev"
logfile=`pwd`/logs/remecore_$NODE_ENV"_"`date "+%y%m%d:%H:%M:%S"`.log
forever start -l $logfile server.js
