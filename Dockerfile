FROM node:20

WORKDIR /app

COPY . .
RUN npm install

# For debugging purposes
RUN apt-get update && apt-get install -y awscli less

EXPOSE 3000

CMD ["node", "src/demoapp.js"]