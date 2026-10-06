import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve static directory files
app.use(express.static(__dirname));

// Route handlers for clean HTML fallbacks
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

app.get('/portal', (req, res) => {
  res.sendFile(path.join(__dirname, 'portal', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`AS Studio server listening on http://0.0.0.0:${PORT}`);
});
