# Diagram Rendering Server

/

## Features

- Supports PlantUML and Mermaid diagram rendering
- Both GET and POST methods available
- Swagger documentation
- Docker support
- GitHub Actions for automated Docker image publishing

## API Endpoints

- GET /render/:type - Render diagram using query parameters
- POST /render/:type - Render diagram using JSON body
- GET /api-docs - Swagger documentation

## Getting Started

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

### Using Docker

1. Build the image:
```bash
docker build -t diagram-server .
```

2. Run the container:
```bash
docker run -p 3000:3000 diagram-server
```

## API Usage Examples

### PlantUML Example

```bash
# Using GET
curl "http://localhost:3000/render/plantuml?diagram=@startuml%0AA%20->%20B:%20Hello%0A@enduml"

# Using POST
curl -X POST http://localhost:3000/render/plantuml \
  -H "Content-Type: application/json" \
  -d '{"diagram": "@startuml\nA -> B: Hello\n@enduml"}'
```

### Mermaid Example

```bash
# Using GET
curl "http://localhost:3000/render/mermaid?diagram=graph%20TD%3BA-->B"

# Using POST
curl -X POST http://localhost:3000/render/mermaid \
  -H "Content-Type: application/json" \
  -d '{"diagram": "graph TD\nA-->B"}'
```

## Documentation

Visit http://localhost:3000/api-docs for the Swagger documentation when the server is running.