import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.js';
import { tasksRouter } from './routes/tasks.js';
import { focusRouter } from './routes/focus.js';
import './lib/db.js';

const app = express();
const PORT = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/', (_req, res) => {
  res.json({
    ok: true,
    service: 'taskivo-api',
    message: 'Taskivo API is running',
    health: '/health',
    auth: '/auth/login',
    tasks: '/tasks',
    focus: '/focus/sessions',
  });
});

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'taskivo-api', mock: false });
});

app.use('/auth', authRouter);
app.use('/tasks', tasksRouter);
app.use('/focus', focusRouter);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Taskivo API running on http://localhost:${PORT}`);
  console.log(`Demo OTP: ${process.env.DEMO_OTP ?? '123456'}`);
});
