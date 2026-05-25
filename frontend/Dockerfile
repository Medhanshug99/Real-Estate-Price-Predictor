FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

# We use npm install since this is development
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
