export NODE_ENV="live"
logfile=`pwd`/logs/remecore_$NODE_ENV"_"`date "+%y%m%d:%H:%M:%S"`.log
forever start -l $logfile server.js
