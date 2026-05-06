## Setup MongoDB locally
Mongo DB has paused the proj permanently after not being used for a long time, so 2 solutions were done:
1. Docker: failed at installing docker desktop on my wins machine. If other machine works, run: ```docker compose up -d```
2. WSL: worked. How to start:
    - Open Ubuntu terminal
    - Import the MongoDB public key: ```curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg --dearmor```                         
    - For Ubuntu 24.04 (Noble):
  ```echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8. multiverse" sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list```
    - Install: ```sudo apt-get update && sudo apt-get install -y mongodb-org``
    - Start MongoDB:
        ```sudo mkdir -p /data/db``
        ```sudo mongod --dbpath /data/db --fork --logpath /tmp/mongod.log```

