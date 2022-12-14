FROM node:16
WORKDIR /app
COPY . .
RUN npm install -g pnpm
RUN pnpm i

EXPOSE 8188
CMD ["npm","run","start"]