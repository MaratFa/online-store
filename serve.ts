
import express from 'express';
import path from 'path';

const app: express.Express = express();
const port: number = Number(process.env.PORT) || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'build')));

// All requests return index.html
app.get('*', (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
