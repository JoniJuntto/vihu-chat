FROM node:18 
WORKDIR /app
COPY . .
RUN npm ci
ENV NODE_ENV production
EXPOSE 8000
CMD [ "npx", "src/index.ts" ]