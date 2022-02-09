# ReMeCore
Provides a minimal SSO capability for the ReMe Wallet  and RRP

## POST ../auth/register 

### Parameters: None
### Request Body - Required - application/jon
 
  {
  "firstname": "string",
  "lastname": "string",
  "password": "string",
  "username": "string" // always email address 
  }
  
### Responses
  On success returns 201 "user created" and <user_id>

  On failure returns 409 "Duplicate UserName not allowed"

## POST ../auth/login <JSON \<username>\<password>> 

{
  "username" : "string",
  "password" : "string"
}
  On success returns 200 \<JWT>

  On failure returns 401 "Unauthorized"

## GET ../auth/verification_key

  On success returns 200 \<PublicKey> in PEM format 

## POST  ../auth/confirm <JSON \<id>\<password>\<time>\<token>> 


{
  "id": "string",
  "password": "string",
  "time": 0,
  "token": "string"
}

Complete a password reset
Completes a password reset request, setting the user's password to the provided value

The password reset URL (in the email) contains all of the required fields to make this request except for the new password

Note that password reset tokens can only be used once and have an expiry

## POST ../auth/forgot

{
  "username": "string"
}
Request a password reset email
Sends a password reset email to the provided email address if a matching user is found

## GET ../users/\<User Id>

   On success returns 200 \<User details> as \<JSON \<username>\<firstname>\<lastname>\<email>>

   On failure returns 404 "Not found"
   
   

   
# Configuration
## Directory Layout

## Nginx Proxy Server

### SSL Config

## Mongo DB
DEV_MONGODB_URL='mongodb://127.0.0.1:27017/devcore'
STAGING_MONGODB_URL='mongodb://127.0.0.1:27017/stagingcore'
LIVE_MONGODB_URL='mongodb://127.0.0.1:27017/remecore'
PUBLIC_KEY='keys/public.pem'
PRIVATE_KEY='keys/private.pem'
DEV_PORT=3456
STAGING_PORT=4567
LIVE_PORT=5678

## Service Startup


# ReMe Specific Config
