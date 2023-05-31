building the image:
- `docker build -t adnanjpg/node-chat-server:1 .`

running:

- `docker pull adnanjpg/node-chat-server:1`
- `docker run -p 49160:8080 adnanjpg/node-chat-server:1`: -p 49160:8080 maps the port 8080 of the container to port 49160 of the host machine. this app runs on 8080 port of the container, so we map it to the host machine port 49160. client apps can access this app using [machine ip]:49160, or when running the image on local, localhost:49160