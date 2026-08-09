FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Unprivileged node user execution
USER node

EXPOSE 3000

CMD ["npm", "start"]