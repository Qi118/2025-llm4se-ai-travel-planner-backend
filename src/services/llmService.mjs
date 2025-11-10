import 'dotenv/config';
import OpenAI from "openai";

export async function askBailian(prompt) {
    const openai = new OpenAI({
        apiKey: process.env.DASHSCOPE_API_KEY,
        baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
    });

    const completion = await openai.chat.completions.create({
        model: "qwen-plus",
        messages: [
            { role: "system", content: "You are a helpful AI travel assistant." },
            { role: "user", content: prompt }
        ]
    });

    return completion.choices[0].message.content;
}
