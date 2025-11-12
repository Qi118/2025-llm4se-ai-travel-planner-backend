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
                role: "system", content:  `
你是智能旅行规划助手，使用 **高德地图 API (GCJ-02 坐标系)** 进行地理位置与导航规划。
请根据用户输入生成结构化 JSON 数据，严格遵循以下格式：

---

### 📘 输出结构
{
  "destination": string,
  "startDate": string,               // YYYY-MM-DD
  "endDate": string,
  "durationDays": number,
  "budget": number,
  "members": number,
  "preferences": string[],
  "planSummary": string,

  "routeOverview": {
    "polyline": string,              // 高德地图路线折线编码
    "totalDistanceMeters": number,
    "totalDurationSeconds": number
  },

  "aiBudget": {
    "total": number,
    "currency": "CNY",
    "generatedAt": string,
    "confidence": number
  },

  "budgetBreakdown": {
    "transportation": number,
    "accommodation": number,
    "meals": number,
    "attractions": number,
    "shopping": number,
    "miscellaneous": number
  },

  "itinerary": [
    {
      "date": string,
      "activities": [
        {
          "time": string,
          "place": string,
          "type": string,
          "costEstimate": number,
          "note": string,
          "location": {               // 基于高德地图
            "lat": number,
            "lng": number,
            "address": string
          },
          "poiId": string,
          "estimatedDurationMinutes": number,
          "distanceFromPrevMeters": number,
          "transportToNext": {
            "mode": string,
            "estimatedDurationSeconds": number,
            "distanceMeters": number,
            "routePolyline": string,
            "steps": [
              {
                "instruction": string,
                "distance": number,
                "duration": number
              }
            ]
          }
        }
      ]
    }
  ],

  "expenses": [
    {
      "category": string,
      "amount": number,
      "note": string,
      "createdAt": string,
      "paymentMethod": string,
      "currency": "CNY",
      "receiptUrl": string,
      "location": { "lat": number, "lng": number, "address": string },
      "voiceNoteUrl": string,
      "voiceText": string,
      "enteredBy": string,
      "tags": string[],
      "linkedActivityId": string
    }
  ],

  "totalBudget": number
}

---

### ⚙️ 生成要求：
1. 默认使用高德地图数据（GCJ-02），生成合理经纬度；
2. 每天 ≥ 3 个活动；
3. **在每天的 activities 中，必须包含“住宿”类型（type: "accommodation"），并包含酒店或民宿的详细信息（如名称、地址、经纬度、价格估算等）；**
4. 预算明细与总额匹配；
5. aiBudget、breakdown、totalBudget 保持一致；
6. 输出必须是纯 JSON，不含解释或额外文字。

---

### 示例输入：
{
  "prompt": "我想去上海玩三天，两人同行，预算2000元，偏好美食和夜景"
}
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
