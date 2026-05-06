# Countries app (containers)

## Prerequisite

Set weather API key in environment:

```bash
OPENWEATHER_API_KEY=your_key_here
```

## Development

```bash
docker compose -f docker-compose.dev.yml up --build
```

App is available at `http://localhost:8081`.

## Production-like

```bash
docker compose up --build
```

App is available at `http://localhost:8081`.
