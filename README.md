markdown
# 🎧 IT Help Desk Voice AI Agent
### *LiveKit 1.0 • TypeScript • MongoDB • Deepgram*

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![LiveKit](https://img.shields.io/badge/LiveKit-0052CC?style=for-the-badge&logo=livekit&logoColor=white)

An automated voice assistant designed to handle IT support calls, categorize technical issues, and persist validated tickets to a database in real-time. This project demonstrates a production-ready **STT → LLM → TTS** pipeline focused on sub-2-second latency and robust conversational state management.

---

## 🏗️ System Architecture

The project follows a modular design to ensure clear separation of concerns, making the system easier to maintain and scale.

| File | Responsibility |
| :--- | :--- |
| **`main.ts`** | **Orchestration**: Manages the Worker lifecycle, room connections, and Silero VAD pre-warming. |
| **`tools.ts`** | **Actions**: Contains `llm.tool` definitions for `create_ticket` and `edit_ticket` with Zod validation. |
| **`db.ts`** | **Persistence**: Handles MongoDB connection logic and schema-safe CRUD operations. |
| **`prompts.ts`** | **Logic**: Defines the "Heart" of the agent—business rules, persona, and pricing tiers. |



---

## 🚀 Technical Highlights

### ⚡ Performance & Latency
To meet the "Natural Conversation" requirement, the agent is optimized for speed:
* **Silero VAD**: Pre-warmed during the worker startup phase to eliminate "first-turn" delay.
* **Deepgram Nova-2 & Aura**: Selected for high-speed processing to keep total turn-around latency under 2 seconds.

### 🧠 Intelligent Edge-Case Handling
This implementation moves beyond a simple LLM wrapper by using **Hybrid Logic**:
* **The Correction Tool**: Integrated an `edit_ticket` tool specifically to handle users changing their mind (e.g., *"Wait, change my phone number to..."*). This updates the database record mid-call.
* **Anti-Hallucination**: Business rules are hard-coded in the prompt. The agent cannot negotiate prices or handle unsupported IT issues.

### 💰 Business Pricing Rules
| Issue | Service Provided | Fixed Fee |
| :--- | :--- | :--- |
| **Wi-Fi Not Working** | Network Troubleshooting | **$20** |
| **Email Login** | Password Reset | **$15** |
| **Slow Laptop** | CPU Optimization / Change | **$25** |
| **Printer Problems** | Power Plug Change | **$10** |



---

## 🛠️ Setup & Installation

### 1. Prerequisites
* **pnpm** installed
* **MongoDB** (Local instance or Atlas)
* API Keys: **LiveKit**, **OpenAI**, and **Deepgram**

### 2. Deployment
```bash
# 1. Install dependencies
pnpm install

# 2. Download required VAD models
pnpm run download-files

# 3. Configure Environment
# Create a .env file and add your credentials (see .env.sample)

# 4. Start the Agent
pnpm run dev

```

---

## 🧪 Submission Checklist

* [x] **Video Demo**: Real-time interaction showing "Golden Path" and error correction.
* [x] **Database Schema**: Structured MongoDB documents with TypeScript interfaces.
* [x] **Tool Usage**: `create_ticket` and `edit_ticket` implemented with Zod validation.
* [x] **Business Integrity**: Fixed-fee rules enforced via strict system prompts.

```
