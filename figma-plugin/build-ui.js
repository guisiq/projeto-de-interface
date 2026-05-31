/**
 * Build script: injects connection JSONs into ui.html
 * Run: node build-ui.js
 */
const fs = require('fs');
const path = require('path');

const internalPath = path.join(__dirname, 'src', 'connections-internal.json');
const uiTemplatePath = path.join(__dirname, 'src', 'ui-template.html');
const uiOutputPath = path.join(__dirname, 'src', 'ui.html');

const internal = fs.readFileSync(internalPath, 'utf8');
let uiHtml = fs.readFileSync(uiTemplatePath, 'utf8');

// Replace placeholder with actual JSON (only internal — bottom nav is generated in JS)
uiHtml = uiHtml.replace('CONNECTIONS_INTERNAL_PLACEHOLDER', internal.trim());

// Write output
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

fs.writeFileSync(uiOutputPath, uiHtml, 'utf8');
const sizeKB = (fs.statSync(uiOutputPath).size / 1024).toFixed(1);
console.log('✅ ui.html atualizado (' + sizeKB + ' KB) com ' + JSON.parse(internal).length + ' conexões internas + bottom nav gerado dinamicamente.');
