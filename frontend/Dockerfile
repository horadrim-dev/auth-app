FROM node:22.5.1-alpine AS build

ARG APIurl
ENV urlAddress=${APIurl}

RUN mkdir /app
WORKDIR /app
COPY app/package.json \
	 app/package-lock.json \
	 ./
RUN npm install
COPY app/ .
RUN npm run build --production

FROM nginx:1.27.0-alpine
COPY --from=build /app/dist/app/browser /usr/share/nginx/html