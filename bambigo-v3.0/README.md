# BambiGO 開發技術文件 v3.0

> 🦌 城市導航助手 - 將焦慮轉譯為行動

---

## ⚠️ 重要聲明

**「BambiGO」為內部開發技術代號，最終產品品牌名稱待定。**

本文件是「指導原則」而非「完整規格」。AI 開發代理應理解設計理由後自行推演完整實作。

---

## 🎯 專案簡介

BambiGO 是「焦慮經紀人」(Broker of Anxiety)，為外國遊客解決日本交通系統中的真實焦慮。

**核心差異**：
- 不只給路線，還給「建議」
- 理解情境（下雨、趕時間、帶小孩）
- 用你的語言，用你能理解的方式

---

## 📁 文件結構

```
bambigo-v3.0/
├── .trae/
│   └── rules/
│       ├── 00_OVERVIEW.md          # 專案總覽、設計哲學
│       ├── 01_TAGGING_SYSTEM.md    # L1-L4 標籤系統
│       ├── 02_AI_ARCHITECTURE.md   # AI 混合架構
│       ├── 03_DATA_ORIGIN.md       # 靜態數據原則
│       ├── 04_NODE_INHERITANCE.md  # 母子節點繼承
│       ├── 05_DB_SCHEMA.md         # 資料庫結構
│       ├── 06_UI_SPEC.md           # 介面規格
│       ├── 07_N8N_WORKFLOWS.md     # 自動化流程
│       └── 08_TECH_STACK.md        # 技術選型
└── README.md                       # 本文件
```

---

## 🔑 核心概念速覽

### 四層標籤系統 (L1-L4)

| 層級 | 名稱 | 數據類型 | 更新頻率 |
|------|------|----------|----------|
| L1 | 地點基因 | 🧊 冷數據 | 每季 |
| L2 | 即時狀態 | 🔥 熱數據 | 15 分鐘 |
| L3 | 服務機能 | 🌡️ 溫數據 | 每月 |
| L4 | 行動策略 | 即時生成 | 不儲存 |

### AI 混合架構

```
Rule-based (60%)  →  < 10ms    →  $0
SLM (30%)         →  50-200ms  →  $0 (本地)
LLM (10%)         →  1-3s      →  $0.002/次
```

### 同心圓服務範圍

- **Core（核心圈）**：完整 L1-L4 服務
- **Buffer（緩衝圈）**：基本路線，誠實說「這裡我不熟」
- **Outer（外部圈）**：引導至 Google Maps

---

## 🚀 快速開始

### 1. 環境準備

```bash
# Node.js 18+
node -v

# pnpm
npm install -g pnpm

# Supabase CLI
npm install -g supabase
```

### 2. 專案初始化

```bash
# Clone
git clone https://github.com/xxx/bambigo.git
cd bambigo

# 安裝依賴
pnpm install

# 設定環境變數
cp .env.example .env.local
```

### 3. 資料庫設定

```bash
# 啟動本地 Supabase
supabase start

# 執行 Migration
supabase db push

# 產生型別
pnpm db:generate
```

### 4. 啟動開發

```bash
# 啟動 Next.js
pnpm dev

# 另一個終端，啟動 Ollama (可選)
ollama serve
ollama pull gemma2:2b
```

---

## 📖 閱讀順序建議

### 給產品經理 / 設計師

1. `00_OVERVIEW.md` - 理解設計哲學
2. `01_TAGGING_SYSTEM.md` - 理解數據結構
3. `06_UI_SPEC.md` - 介面規格

### 給後端開發者

1. `00_OVERVIEW.md` - 整體架構
2. `03_DATA_ORIGIN.md` - 數據策略（最重要！）
3. `05_DB_SCHEMA.md` - 資料庫設計
4. `07_N8N_WORKFLOWS.md` - 自動化流程

### 給前端開發者

1. `00_OVERVIEW.md` - 整體架構
2. `01_TAGGING_SYSTEM.md` - 數據結構
3. `06_UI_SPEC.md` - UI 元件設計
4. `08_TECH_STACK.md` - 技術選型

### 給 AI 開發代理

1. **全部讀完**
2. 特別注意「給 AI 開發代理的指引」區塊
3. 理解「為什麼」比「是什麼」更重要

---

## ⚡ 關鍵提醒

### ❌ 不要做

- 在 App 執行時呼叫 Overpass API 計算 L1 標籤
- 顯示 L1-L4 等內部術語給使用者
- 顯示空類別（count = 0）
- 讓 LLM 決定商業導流

### ✅ 要做

- L1 標籤預先計算後儲存
- 使用者友善名稱（周邊環境、即時資訊）
- 有則標、無則略
- 商業導流用 Rule-based

---

## 🔗 相關資源

| 資源 | 連結 |
|------|------|
| ODPT 開發者網站 | https://developer.odpt.org/ |
| 競賽官網 | https://challenge.odpt.org/ |
| Supabase 文件 | https://supabase.com/docs |
| Dify 文件 | https://docs.dify.ai/ |

---

## 📅 競賽資訊

**日本公共交通開放數據挑戰賽 2025**

- 最終發表：2026 年 2 月 21 日（東京）
- 驗證場域：東京都心（台東區、千代田區、中央區）

---

## 📝 版本歷史

| 版本 | 日期 | 說明 |
|------|------|------|
| v3.0 | 2025-12-22 | 整合 AI 混合架構、L1-L4 標籤系統、靜態數據原則 |
| v2.1 | 2025-12 | 新增 AI_ARCHITECTURE.md |
| v2.0 | 2025-12 | 初版技術文件 |

---

*最後更新：2025-12-22*
