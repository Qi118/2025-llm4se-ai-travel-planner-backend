import express from "express";
import dotenv from "dotenv";
import aiRoutes from "./routes/ai.mjs";

dotenv.config();

const app = express();
app.use(express.json());

// 路由挂载
app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 服务器已启动：http://localhost:${PORT}`);
});
