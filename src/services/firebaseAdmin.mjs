// import admin from "firebase-admin";
// import { HttpsProxyAgent } from "https-proxy-agent";
// import serviceAccount from "../../serviceAccountKey.json" assert { type: "json" };
//
// // 创建代理实例（Clash HTTP 代理端口通常是 7890）
// const proxyAgent = new HttpsProxyAgent("http://127.0.0.1:7890");
//
// // 初始化 Firebase Admin
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     // 通过自定义 gaxSettings 设置代理
//     firestoreSettings: {
//         host: "firestore.googleapis.com",
//         ssl: true,
//         // 通过 gax 客户端设置 httpsAgent
//         // Node.js SDK 内部使用 google-gax，可以设置 httpAgent
//         // @ts-ignore
//         customHttpsAgent: proxyAgent
//     }
// });
//
// const db = admin.firestore();
//
// export { admin, db };
