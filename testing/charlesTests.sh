#! /bin/bash 
# Get  Start
charles="http://devcore.remelife.com:2345"
#staging="https://devcore.remelife.com:8492"
#live="https://coresso.remelife.com:8000"


URL=$charles
#URL=$staging
#URL=$live

## Get Verification Key

curl -X GET $URL/auth/verification_key

testName=`date +%s|md5sum|cut -c1-20`
firstname="First-"$testName
lastname="Last"$testName
username=$firstname$lastname"@surreydemo.co.uk"
password="testing123"


## Register User

echo '{"firstname":"'$firstname'", "lastname":"'$lastname'","username":"'$username'","email":"'$username'","password":"'$password'"}'
user=`curl -X POST -H "Content-Type: application/json" \
--data '{"firstname":"'$firstname'", "lastname":"'$lastname'","username":"'$username'","email":"'$username'","password":"'$password'"}' \
$URL/auth/register`
echo $user

## Get UserId
id=`echo $user | cut -d'"' -f4`
echo $id

curl -X GET  $URL/users/$id

## Login



userLogin=`curl -X POST -H "Content-Type: application/json" \
--data '{"username":"'$username'","password":"'$password'"}' \
$URL/auth/login`
echo $userLogin

