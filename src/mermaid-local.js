const {spawn} = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

async function renderMermaidLocally(diagram, output) {
    // Create temp directory for diagram files
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'mermaid-'));
    const inputFile = path.join(tempDir, 'diagram.mmd');
    const outputFile = path.join(tempDir, `diagram.${output}`);

    try {
        // Write diagram to temp file
        await fs.writeFile(inputFile, diagram);

        // Execute Mermaid CLI to generate output
        await new Promise((resolve, reject) => {
            const mermaid = spawn('./node_modules/.bin/mmdc', [
                '-i', inputFile,
                '-o', outputFile,
                '-t', 'default'
            ]);

            mermaid.on('error', (err) => {
                console.error(`Failed to execute Mermaid: ${err.message}`);
                reject(new Error(`Failed to execute Mermaid: ${err.message}`));
            });

            mermaid.stderr.on('data', (data) => {
                console.error(`Mermaid Error: ${data}`);
            });

            mermaid.stdout.on('data', (data) => {
                console.log(`Mermaid Output: ${data}`);
            });

            mermaid.on('close', (code) => {
                if (code === 0) resolve();
                else reject(new Error(`Mermaid process exited with code ${code}`));
            });
        });
        const fileBuffer = await fs.readFile(outputFile);
        return fileBuffer.toString('base64');
    } finally {
        // Cleanup temp files
        await fs.rm(tempDir, {recursive: true, force: true});
    }
}
module.exports = {renderMermaidLocally};