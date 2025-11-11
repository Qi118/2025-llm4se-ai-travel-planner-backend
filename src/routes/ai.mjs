import express from "express";
import { generateItinerary } from "../services/llmService.mjs";

const router = express.Router();

/**
 * POST /api/ai
 * body: { prompt: string }
 * 后端只调用大模型返回 JSON，前端负责存储到 Firebase
 */
router.post("/", async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: "prompt 必填" });

        console.log("=== 接收到请求 ===", req.body);
        console.log("=== 调用大模型前 ===");

        const aiResponse = await generateItinerary(prompt);

        console.log("=== 调用大模型返回 ===");
        console.log("大模型返回:", JSON.stringify(aiResponse, null, 2));
        console.log("====================");

        // 直接将大模型返回的 JSON 发给前端
        res.json({ itineraryData: aiResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
