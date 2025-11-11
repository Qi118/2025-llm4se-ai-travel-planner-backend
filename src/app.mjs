import express from 'express';
import cors from 'cors';
import aiRouter from './routes/ai.mjs';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // 允许的前端地址
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));

app.use(express.json());

// 挂载路由
app.use('/api/ai', aiRouter);

app.listen(3000, () => {
    console.log('🚀 服务器已启动：http://localhost:3000');
});
