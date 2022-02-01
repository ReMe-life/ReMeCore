# ReMeCore
ReMe SSO and Event 
Provides a minimal SSO capability for the ReMe Wallet  and RRP

POST ../auth/register <JSON <firstname><lastname><email>":"testBB02","email":"testBB@test.com","password":"testing1234"}' \
https://devcore.remelife.com:8492/auth/register`





PUT ../admin/user-update-password  <JSON <secret key>,<username>,<new password>>
---> update users password with new password value and returns 200
This API will be called from both remelife and reme.care when a user changes their password

GET ../admin/user-JWT  <JSON <secret key>,<username> >    
---> will return 200 and a valid JWT used for SSO for the specified user or a 401 if no user, 404 etc
This API should be called from the server when a user logs in
