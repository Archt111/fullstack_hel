# todo-app 

## Development 
Nginx is the single public entrypoint and routes `/api` to the backend.

```bash
cd Part 12-containers/fs-containers/todo-app
docker compose -f docker-compose.dev.yml up --build
```

Access the app at: http://localhost:8080 

## Production

The production flow builds production images for the frontend and backend and runs them behind Nginx which serves static files and proxies `/api` to the backend.

```bash
cd Part 12-containers/fs-containers/todo-app
docker build -t todo-front ./todo-frontend
docker build -t todo-backend ./todo-backend
docker compose up --build
```

The production app is available at: http://localhost:8080 
