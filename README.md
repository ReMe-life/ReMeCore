# ReMeCore
Provides a minimal SSO capability for the ReMe Wallet  and RRP

## POST ../auth/register \<JSON New User>

  New User ::=  \<username>\<firstname>\<lastname>\<email>\<password>


  On success returns 201 "user created" and <user_id>

  On failure returns 409 "Duplicate UserName not allowed"

## POST ../auth/login <JSON \<username>\<password>> 

  On success returns 200 \<JWT>

  On failure returns 401 "Unauthorized"

## GET ../auth/verification_key

  On success returns 200 \PublicKey in PEM format 

## GET ../users/\<User Id>

   On success returns 200 \<User details>

   On failure returns 404 "Not found"
