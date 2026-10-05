import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('*', (_req: Request, res: Response) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Workspace Cleared — Ready for Rebuild</title>
  <style>
    body {
      background-color: #0E0E10;
      color: #F4F4F6;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
    }
    .card {
      text-align: center;
      padding: 2.5rem;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 1rem;
      background: rgba(255,255,255,0.03);
      max-width: 500px;
    }
    h1 {
      font-size: 1.5rem;
      margin-bottom: 0.75rem;
      font-weight: 700;
    }
    p {
      color: #A1A1AA;
      font-size: 0.95rem;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Workspace Cleared</h1>
    <p>All old files have been completely removed. The workspace is empty and ready for your fresh rebuild files.</p>
  </div>
</body>
</html>`);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Clean server listening on port ${PORT}`);
});
