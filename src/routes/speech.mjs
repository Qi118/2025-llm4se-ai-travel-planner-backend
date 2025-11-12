import express from 'express'
import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config()
const router = express.Router()

const APPID = process.env.SPEECH_APP_ID
const API_KEY = process.env.SPEECH_API_KEY
const API_SECRET = process.env.SPEECH_API_SECRET

// GET /api/speech → 返回签名的 WebSocket URL
router.get('/', (req, res) => {
    try {
        const host = 'ws-api.xfyun.cn'
        const date = new Date().toUTCString()
        const signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/iat HTTP/1.1`
        const signatureSha = crypto.createHmac('sha256', API_SECRET)
            .update(signatureOrigin)
            .digest('base64')
        const authorizationOrigin = `api_key="${API_KEY}", algorithm="hmac-sha256", headers="host date request-line", signature="${signatureSha}"`
        const authorization = Buffer.from(authorizationOrigin).toString('base64')

        const url = `wss://${host}/v2/iat?authorization=${authorization}&date=${encodeURIComponent(date)}&host=${host}&app_id=${APPID}`
        res.json({ url })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: '生成签名失败' })
    }
})

export default router
