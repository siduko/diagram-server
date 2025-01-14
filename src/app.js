const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const cors = require('cors');
const {renderPlantUMLLocally} = require("./plantuml-local");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Swagger documentation
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.get('/render/:type', async (req, res) => {
    const {type} = req.params;
    const {diagram} = req.query;

    if (!diagram) {
        return res.status(400).json({error: 'Diagram content is required'});
    }

    try {
        let result;
        switch (type.toLowerCase()) {
            case 'plantuml':
                const {renderPlantUMLLocally} = require('./plantuml-local');
                const svg = await renderPlantUMLLocally(diagram);
                return res.json({svg});
            case 'mermaid':
                const mermaidModule = await import('mermaid');
                result = await mermaidModule.default.render('diagram', diagram);
                return res.json({svg: result.svg});
            default:
                return res.status(400).json({error: 'Unsupported diagram type'});
        }
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
});

app.post('/render/:type', async (req, res) => {
    const {type} = req.params;
    const {diagram, output} = req.body;

    if (!diagram) {
        return res.status(400).json({error: 'Diagram content is required'});
    }

    try {
        let contentFile;
        switch (type.toLowerCase()) {
            case 'plantuml':
                const {renderPlantUMLLocally} = require('./plantuml-local');
                contentFile = await renderPlantUMLLocally(diagram, output);
                return res.json({file: contentFile});
            case 'mermaid':
                const {renderMermaidLocally} = require('./mermaid-local');
                contentFile = await renderMermaidLocally(diagram, output);
                return res.json({file: contentFile});
            default:
                return res.status(400).json({error: 'Unsupported diagram type'});
        }
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
});

app.listen(port, () => {
    console.log(`Diagram server listening at http://localhost:${port}`);
});