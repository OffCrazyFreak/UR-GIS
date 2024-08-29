# Geographic Information System (GIS)

## Deploy instructions
### Server setup:
- install Nginx, Node.js, npm, Docker, Docker Compose, certbot and python3-certbot-nginx on server (if there are errors, check if they actually are the latest versions)

#### For inital deploy:
- git clone repo in home directory
- cd into the cloned repo
- in nginx-appname.conf file comment (#) the localhost line and uncomment the line with your domain
- copy and change database connection variables from .env.example to a new .env file
- run ./setup-and-deploy.sh
- setup SSL for the new app/domain
  - certbot --nginx

#### For redeploys:
- run ./redeploy.sh

#### For removing app and configuration (USE WITH CAUTION, IT DELETES EVERYTHING):
- run ./cleanup.sh
