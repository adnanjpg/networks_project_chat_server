FROM node:alpine
CMD ["touch", ".env"]
# write running-env="docker" in .env file
CMD ["echo", "running-env=\"docker\"", ">>", ".env"]
COPY package.json .
RUN npm install\
        && npm install typescript -g
COPY . .
RUN tsc
CMD ["npm", "run", "dev"]
