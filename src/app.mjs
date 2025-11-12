import express from 'express'
import cors from 'cors'
import aiRouter from './routes/ai.mjs'
import speechRouter from './routes/speech.mjs' // ✅ 新增

const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}))

app.use(express.json())

app.use('/api/ai', aiRouter)
app.use('/api/speech', speechRouter) // ✅ 新增语音接口

app.listen(3000, () => {
    console.log('🚀 服务器已启动：http://localhost:3000')
})
