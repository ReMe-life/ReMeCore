#! /bin/bash 
# Get  Start
charles="http://devcore.remelife.com:2345"
dev="http://devcore.remelife.com:8491"
staging="https://devcore.remelife.com:8492"
live="https://coresso.remelife.com:8000"


#URL=$dev
#URL=$charles
#URL=$staging
URL=$live

## Get Verification Key
echo Get Verification Key

curl -X GET $URL/auth/verification_key

testName=`date +%s|md5sum|cut -c1-20`
firstname="First-"$testName
lastname="Last"$testName
username=$firstname$lastname"@surreydemo.co.uk"
password="testing123"


echo "==================================================================+"
## Register User
echo Register User

echo '{"firstname":"'$firstname'", "lastname":"'$lastname'","username":"'$username'","email":"'$username'","password":"'$password'"}'
user=`curl -X POST -H "Content-Type: application/json" \
--data '{"firstname":"'$firstname'", "lastname":"'$lastname'","username":"'$username'","email":"'$username'","password":"'$password'"}' \
$URL/auth/register`
echo $user

## Get UserId
echo Get UserId
id=`echo $user | cut -d'"' -f4`
echo $id

curl -X GET  $URL/users/$id

echo "==================================================================+"
## Login
echo Login



userLogin=`curl -X POST -H "Content-Type: application/json" \
--data '{"username":"'$username'","password":"'$password'"}' \
$URL/auth/login`
echo $userLogin

echo "==================================================================+"
## Forgot
echo Forgot
echo '{"username":"'$username'"}'
forgot=`curl -X POST -H "Content-Type: application/json" \
--data '{"username":"'$username'","baseurl":"https://wallet.remelife.com/change-password"}' \
$URL/auth/forgot`

echo $forgot
token=`echo $forgot | cut -d'"' -f12`
echo "==================================================================+"
## Confirm
password="hello123"
echo Confirm
echo  '{"id":"'$id'", "password":"'$password'","time":"000","token":"'$token'"}' 
echo "+++++++++++"
echo
confirm=`curl -X POST -H "Content-Type: application/json" \
--data '{"id":"'$id'", "password":"'$password'","time":"000","token":"'$token'"}' \
$URL/auth/confirm`

echo $confirm
echo "==================================================================+"
## Login
echo Login



userLogin=`curl -X POST -H "Content-Type: application/json" \
--data '{"username":"'$username'","password":"'$password'"}' \
$URL/auth/login`
echo $userLogin

