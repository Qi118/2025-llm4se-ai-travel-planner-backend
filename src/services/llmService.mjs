// src/api/aiItinerary.js
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = process.env.DASHSCOPE_BASE_URL || "https://dashscope.aliyuncs.com/compatible-mode/v1";
const API_KEY = process.env.DASHSCOPE_API_KEY;

/**
 * 调用大语言模型生成行程规划和预算
 * @param {string} prompt 用户输入内容，如：我想去日本，5天，预算1万元，带孩子
 * @returns {Promise<Object>} 返回结构化行程数据
 */
export async function generateItinerary(prompt) {
    if (!prompt) {
        throw new Error("Prompt 不能为空");
    }

    try {
        const response = await axios.post(`${BASE_URL}/chat/completions`, {
            model: "qwen-plus", messages: [{
                role: "system", content: `
你是旅行规划助手。请根据用户输入生成结构化 JSON 数据，严格按照以下要求：

1. 输出 JSON 对象，包含以下字段：
{
  "destination": string,          // 用户输入的目的地
  "startDate": string,            // 出发日期，格式 YYYY-MM-DD
  "endDate": string,              // 返回日期，格式 YYYY-MM-DD
  "durationDays": number,         // 旅行天数
  "budget": number,               // 总预算
  "members": number,              // 同行人数
  "preferences": string[],        // 用户旅行偏好，如 ["美食","动漫"]
  "planSummary": string,          // AI 生成的行程概览（简短文字）
  "itinerary": [                  // 每日行程
    {
      "date": string,             // 日期 YYYY-MM-DD
      "activities": [
        {
          "time": string,        // 时间，如"上午 9:00"
          "place": string,       // 地点
          "type": string,        // 类型：景点/餐厅/交通
          "costEstimate": number,// 预计花费
          "note": string         // 备注
        }
      ]
    }
  ],
  "expenses": [                   // 预算/消费明细
    {
      "category": string,         // 分类：住宿/餐饮/交通/娱乐等
      "amount": number,           // 金额
      "note": string,             // 备注
      "createdAt": string         // 时间 ISO 格式
    }
  ],
  "totalBudget": number,          // 总预算
  "breakdown": {                  // 各项费用明细
    "transportation": number,
    "accommodation": number,
    "meals": number,
    "attractions": number,
    "shopping": number,
    "miscellaneous": number
  }
}

2. 用户输入示例：
{
  "prompt": "我想去北京，两天，预算1000元，2人同行，喜欢美食和景点"
}

3. 根据用户输入生成：
- itinerary 数组长度 = durationDays
- 每天至少安排 3 个活动，包含 time、place、type、costEstimate、note
- 总预算 totalBudget = 各项花费之和
- breakdown 填写详细费用

4. 只返回 JSON，不要返回任何额外文本，不要带解释说明。

`
            }, {role: "user", content: prompt}]
        }, {
            headers: {
                "Authorization": `Bearer ${API_KEY}`, "Content-Type": "application/json"
            }
        });

        // 从 AI 返回的文本中解析 JSON
        const content = response.data.choices[0].message.content;

        let itineraryData;
        try {
            itineraryData = JSON.parse(content);
        } catch (err) {
            console.error("解析 AI 返回的 JSON 失败:", content);
            throw new Error("AI 返回格式错误");
        }

        return itineraryData;

    } catch (error) {
        console.error("AI 调用失败:", error.response?.data || error.message);
        throw new Error("AI 调用失败");
    }
}
