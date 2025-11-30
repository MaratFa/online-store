
import express from 'express';
import path from 'path';

const app: express.Express = express();
const port: number = Number(process.env.PORT) || 3000;

// 提供静态文件
app.use(express.static(path.join(__dirname, 'build')));

// 所有请求都返回index.html
app.get('*', (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
