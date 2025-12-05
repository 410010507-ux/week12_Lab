## Week11 

## CRUD 是指：
- **Create**：建立新資料，例如新增一筆報名紀錄。
- **Read**：讀取資料，例如後台查詢所有報名清單。
- **Update**：更新資料，例如修改聯絡電話或報名狀態。
- **Delete**：刪除資料，例如移除重複或取消的報名。
## 環境需求

- Node.js 18+（本機開發使用 v25.x）
- Docker Desktop
- VS Code + REST Client Extension（選用）

## 啟動步驟

1. 啟動 MongoDB（Docker）
cd Week11/docker
docker compose up -d
docker ps   # 應看到 week11-mongo 運行中

2. 使用 mongosh 驗證資料庫
docker exec -it week11-mongo mongosh -u week11-user -p week11-pass --authenticationDatabase week11

show dbs
use week11
show collections
db.participants.find()

3. 啟動後端伺服器
cd ../server
npm install
npm run dev


成功會顯示：

[DB] Connected to MongoDB
Server running on http://localhost:3001

## 測試方式（Testing Methods）
1. 使用 REST Client（tests/api.http）

在 VS Code 打開 tests/api.http，依序點擊各段的 Send Request：

POST /api/signup：新增報名並回傳 _id

GET /api/signup?page=1&limit=10：取得清單與 total

PATCH /api/signup/:id：更新 phone 或 status

DELETE /api/signup/:id：刪除報名

重複 email 會回 409（友善錯誤訊息）

2. 使用 Mongo Shell 驗證資料是否正確寫入
use week11
db.participants.find().pretty()
db.participants.getIndexes()

3. （選用）Compass 檢視資料結構

連線字串：

mongodb://week11-user:week11-pass@localhost:27017/week11?authSource=week11

## 常見問題（FAQ）
1. ECONNREFUSED / 無法連線 MongoDB

→ Docker 未啟動或 Mongo 容器未跑起來

docker ps
docker compose up -d

2. MongoServerError: Authentication failed

→ .env 的帳密與 mongo-init.js 不一致
