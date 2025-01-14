const {spawn} = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

async function renderPlantUMLLocally(diagram, output) {
    // Create temp directory for diagram files
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'plantuml-'));
    const inputFile = path.join(tempDir, 'diagram.puml');
    const outputFile = path.join(tempDir, `diagram.${output}`);

    try {
        // Write diagram to temp file
        await fs.writeFile(inputFile, diagram);

        // Execute PlantUML jar to generate SVG
        await new Promise((resolve, reject) => {
            const plantuml = spawn('java', [
                '-jar',
                path.join(__dirname, '../lib/plantuml.jar'),
                `-t${output}`,
                inputFile
            ]);

            plantuml.on('error', (err) => {
                console.error(`Failed to execute PlantUML: ${err.message}`); // Changed to console.error for better error visibility
                reject(new Error(`Failed to execute PlantUML: ${err.message}`));
            });

            plantuml.stderr.on('data', (data) => { // Added stderr handler to capture error output
                console.error(`PlantUML Error: ${data}`);
            });

            plantuml.stdout.on('data', (data) => { // Added stdout handler to capture any output
                console.log(`PlantUML Output: ${data}`);
            });

            plantuml.on('close', (code) => {
                if (code === 0) resolve();
                else reject(new Error(`PlantUML process exited with code ${code}`));
            });
        });
        const fileBuffer = await fs.readFile(outputFile);
        return fileBuffer.toString('base64');
    } finally {
        // Cleanup temp files
        await fs.rm(tempDir, {recursive: true, force: true});
    }
}
module.exports = {renderPlantUMLLocally};