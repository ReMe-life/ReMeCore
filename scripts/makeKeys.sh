openssl genrsa -out keys/private.pem  4096
openssl rsa -pubout -in keys/private.pem -out keys/public.pem

