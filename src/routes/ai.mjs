import express from "express";
import { askBailian } from "../services/llmService.mjs";

const router = express.Router();

// POST /api/ai
router.post("/", async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: "Missing prompt" });
        }

        const reply = await askBailian(prompt);
        res.json({ reply });
    } catch (error) {
        console.error("AI调用错误：", error);
        res.status(500).json({ error: "AI 调用失败" });
    }
});

export default router;
