FROM node:20.12.0-alpine3.19


WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package.json package-lock.json ./


RUN npm install


COPY . .




RUN npm run build


EXPOSE 3000

CMD ["npm", "run", "start"]