# Stage 1: Test stage
FROM node:24 AS test-stage

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run lint

RUN npm run test


# Stage 2: Build stage
FROM node:24 AS build-stage

WORKDIR /usr/src/app

# Copy verified source from test-stage to ensure tests passed
COPY --from=test-stage /usr/src/app .

ARG VITE_BACKEND_URL='http://localhost:3000'
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

#RUN npm ci

RUN npm run build

# Stage 3: Production stage
FROM nginx:1.29-alpine

# Copy the built dist folder from build-stage
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80
