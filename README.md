### **`README.md`**

```markdown
# 🎧 AI IT Help Desk | LiveKit 1.0 Voice Agent

A high-performance, real-time voice assistant built with the **LiveKit 1.0 Agents-JS SDK**. This agent automates the IT support ticketing process, handling everything from user authentication to fixed-fee pricing and database persistence.

## 🛠 Project Architecture
This project follows a modular design to ensure scalability and clear separation of concerns:

* **`main.ts`**: The orchestration layer. Manages Worker lifecycle, pre-warms VAD models, and initializes the `AgentSession`.
* **`tools.ts`**: The action layer. Contains `llm.tool` definitions for `create_ticket` and `edit_ticket`, mapping natural language intent to database operations.
* **`db.ts`**: The persistence layer. Handles MongoDB connections and schema-safe CRUD operations.
* **`prompts.ts`**: The logic layer. Defines strict business rules, persona guidelines, and fixed-fee pricing structures.

---

## 🚀 Technical Features

### 1. Ultra-Low Latency (<2s)
To meet the "Natural Conversation" requirement, the agent uses:
* **Deepgram Nova-2 (STT)** & **Deepgram Aura (TTS)** for sub-second processing.
* **Silero VAD**: Pre-warmed during worker startup to eliminate "first-turn" delay.

### 2. Intelligent State Management
The bot doesn't just "talk"; it manages data. It handles:
* **Information Collection**: Name, Email, Phone, and Address.
* **Issue Classification**: Automatically maps descriptions to the four supported IT categories ($10 - $25).
* **Real-time Corrections**: If a user says *"Actually, my email is..."*, the `edit_ticket` tool updates the state immediately.

### 3. Database Integrity
Uses **MongoDB** to store tickets with a structured schema including:
`id, name, email, phone, address, issue, price, confirmation_number, created_at`

---

## 🧠 Implementation & Edge Case Handling
The assignment emphasizes that relying solely on an LLM will fail. This system uses a **Hybrid Logic Approach**:

### **Anti-Hallucination & Pricing Integrity**
Instead of allowing the LLM to negotiate, the `IT_ASSISTANT_PROMPT` enforces strict **Business Rules**:
* **Fixed Fees**: Wi-Fi ($20), Email ($15), Laptop ($25), Printer ($10).
* **Validation**: The agent will not create a ticket until the user explicitly agrees to the quoted fee.

### **The "Correction" Edge Case**
To handle users changing their mind (e.g., *"Change my phone to 555-9999"*), I implemented the **`edit_ticket`** tool. 
* This allows the agent to update the database record in real-time without breaking the conversational flow or requiring the user to start over.

### **Graceful Interruptions**
By leveraging the LiveKit `AgentSession`, the agent immediately halts audio playback the moment user speech is detected, ensuring the experience feels human and responsive.

---

## 📥 Setup & Installation

1. **Install dependencies**:
   ```bash
   pnpm install

```

2. **Download AI Models**:
```bash
pnpm run download-files

```


3. **Configure Environment**:
Create a `.env` file (see `.env.sample`) with your LiveKit, OpenAI, and Deepgram keys.
4. **Launch Agent**:
```bash
pnpm run dev

```



---

## 🧪 Submission Checklist

* [x] **Video Demo**: Real-time voice interaction showing the "Golden Path" and corrections.
* [x] **Tool Usage**: `create_ticket` and `edit_ticket` implemented with Zod validation.
* [x] **Database Design**: Structured MongoDB schema with TypeScript interfaces.
* [x] **Latency**: Optimized via model pre-warming and high-speed provider selection.

```

---
