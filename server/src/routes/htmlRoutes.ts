import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

// This route serves the main HTML file for the application
// It is used to render the client-side application
router.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});
export default router;
