FROM node:alpine
WORKDIR /usr/src/app

CMD ["touch", ".env"]

# write running-env="docker" in .env file
CMD ["echo", "running-env=\"docker\"", ">>", ".env"]
COPY package*.json .
RUN npm install\
        && npm install typescript -g
COPY . .
EXPOSE 8080
RUN tsc
CMD ["npm", "run", "dev"]
