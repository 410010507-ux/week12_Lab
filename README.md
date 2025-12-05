## Week11 報名資料庫實作

本專案示範如何使用 Docker + MongoDB + Node.js/Express 完成一個簡單的報名系統 API。

CRUD 是指：
- **Create**：建立新資料，例如新增一筆報名紀錄。
- **Read**：讀取資料，例如後台查詢所有報名清單。
- **Update**：更新資料，例如修改聯絡電話或報名狀態。
- **Delete**：刪除資料，例如移除重複或取消的報名。
## 環境需求

- Node.js 18+（本機開發使用 v25.x）
- Docker Desktop
- VS Code + REST Client Extension（選用）

## 啟動步驟

1. 啟動 MongoDB 容器

```bash
cd Week11/docker
docker compose up -d
docker ps     

2. 
cd Week11/server
npm install
npm run dev

## 截圖說明

- `images/1.png`：docker ps 顯示 week11-mongo 容器運行中
- `images/2.png`：mongosh 查詢 participants 集合內容
- `images/3.png`：REST Client 測試 POST /api/signup 成功畫面
- `images/4.png`：REST Client 測試 GET /api/signup?page=1&limit=10 成功畫面
- `images/5.png`：MongoDB Compass 顯示 week11.participants 結構與資料